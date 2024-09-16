import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/email";
import { sendOtpEmail } from "../utils/sendingOtp";
import catchAsync from "../utils/catchAsync";
import User, { IUser } from "../models/userModel";
import AppError from "../utils/appError";
import OtpModel from "../models/otpModel";

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

const signToken = (id: string): string => {
  return jwt.sign({ id }, "this-is-my-jwt-secret-moses-muni", {
    expiresIn: "90d",
  });
};

const createSendToken = (
  user: IUser,
  statusCode: number,
  res: Response
): void => {
  const token = signToken(user._id);

  const cookieOptions: {
    expires: Date;
    httpOnly: boolean;
    secure?: boolean;
  } = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  (user.password as unknown) = undefined;

  res.status(200).json({
    status: "success",
    token,
    user,
  });
};

//// USER REGISTRATION AND EMAIL VERIFICATION BY SENDING OTP TO POSTED EMAIL

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
};

export const sendingOtpToEmail = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const otp = generateOTP();

  await OtpModel.create({
    email,
    password,
    otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  const message = `Your Email Verification OTP: ${otp}.\n:Please Put Otp in the Otp field for complete Registration`;

  const subject = "Email Verifation OTP";

  await sendOtpEmail({ email, subject, message });

  res.send({ msg: "OTP sent to email" });
};

export const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;
    const otpNumber = parseInt(otp);

    const record = await OtpModel.findOne({
      email,
      otp: otpNumber,
      expiresAt: { $gt: Date.now() },
    });

    console.log(record);

    if (!record) {
      return res.status(400).send("Invalid or expired OTP");
    }

    const newOne = { email: record?.email, password: record.password };

    const newUser = await User.create(req.body);

    createSendToken(newUser, 200, res);

    req.user = newUser;
  }
);

export const deleteOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.query;

    console.log(email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const record = await OtpModel.findOneAndDelete({ email });

    if (!record) {
      return res.status(400).send("Invalid Credentials");
    }
    res.json({ status: "Succesfully deleted", user: record });
  }
);

export const getOtpUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await OtpModel.find();

  if (!users) {
    return res.json({ status: "No user has being found" });
  }

  res.status(200).json({
    status: "succefully",
    users,
  });
});

/////////////////////////END OF USER REGISTRATION AND EMAIL VERIFICATION

export const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new AppError("Please provide an email and password to log in", 400)
      );
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError("Invalid email or password", 401));
    }

    createSendToken(user, 200, res);

    req.user = user;
  }
);

///////////

const jwtVerify = (token: string, secret: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

export const protect = catchAsync(async function (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded: any = await jwtVerify(
    token,
    "this-is-my-jwt-secret-moses-muni"
  );

  const currentUser: IUser | null = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    );
  }

  req.user = currentUser;

  next();
});

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({ status: "success", user });
  } catch (err) {
    res.status(400).json({ status: "Fail", err });
    console.log(err);
  }
};

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get user based on posted email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(
        new AppError("There is no user with that email address.", 404)
      );
    }

    // 2) Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    console.log(resetToken);

    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save({ validateBeforeSave: false });

    const resetURL = `https://real-estate-dashboard-kappa.vercel.app/resetPassword?token=${resetToken}`;

    console.log("ResetUrl:", resetURL);

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset token (valid for 10 min)",
        message,
      });

      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
        resetToken,
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          "There was an error sending the email. Try again later!",
          500
        )
      );
    }
  }
);

export const forgotPasswordForNormalUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get user based on posted email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(
        new AppError("There is no user with that email address.", 404)
      );
    }

    // 2) Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    console.log(resetToken);

    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save({ validateBeforeSave: false });

    const resetURL = `http://127.0.0.1:3000?token=${resetToken}`;

    console.log("ResetUrl:", resetURL);

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset token (valid for 10 min)",
        message,
      });

      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
        resetToken,
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          "There was an error sending the email. Try again later!",
          500
        )
      );
    }
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gte: Date.now() },
    });

    // 2) If token has not expired and there is a user, set the new password
    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;

    await user.save();

    // 3) Log the user in, send JWT
    createSendToken(user, 200, res);
  }
);

export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById((req as any).user._id).select("+password");
    // const user = await User.findById(req.body.id).select("+password");

    if (!user) {
      return next(new AppError("No user with that ID found", 401));
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.passwordCurrent,
      user.password
    );

    if (!isPasswordCorrect) {
      return next(new AppError("Your current password is incorrect.", 401));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();

    createSendToken(user, 200, res);
  }
);
