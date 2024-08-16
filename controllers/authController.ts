import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import User, { IUser } from "../models/userModel";
import AppError from "../utils/appError";

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

export const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create(req.body);

    createSendToken(newUser, 200, res);

    req.user = newUser;
  }
);

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

  console.log("Token: ", token);

  const decoded: any = await jwtVerify(
    token,
    "this-is-my-jwt-secret-moses-muni"
  );

  console.log("Decoded JWT: ", decoded);

  const currentUser: IUser | null = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    );
  }

  // console.log("Current User: ", currentUser);
  req.user = currentUser;
  next();
});

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    // console.log("Current User: ", user);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({ status: "success", user });
  } catch (err) {
    res.status(400).json({ status: "Fail", err });
    console.log(err);
  }
};

export const forgotPassword = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(200).json({
    status: "success",
    data: {
      data: "forgotpassword",
    },
  });
});
