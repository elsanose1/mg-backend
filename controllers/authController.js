const { promisify } = require("util");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModle");
const Factory = require("./handlerFactory");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const signToken = (user) => {
  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const createSendToken = (user, statusCoed, res) => {
  // sign new token
  const token = signToken(user);

  // handle cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: false,
  };

  // check if project on production mode
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  // send token
  res.cookie("jwt", token, cookieOptions);

  // remove passwrod from output
  user.password = undefined;

  res.status(statusCoed).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email & password not null
  if (!email || !password) {
    return next(new AppError("please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  // check if email & password are correct
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError("Email or Password is wrong", 401));
  }

  // send Data if everything is okay
  createSendToken(user, 200, res);
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  const token = signToken(newUser._id);
  createSendToken(newUser, 201, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 3000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // Getting Token and check of is it there
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
      new AppError("You are not logged in! plz login to get access", 401)
    );
  }
  // verification Token
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // check if user still exists
  const currentUser = await User.findById(decodedToken.id);

  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exists.",
        401
      )
    );
  }

  // check if user Changed password after the token was issued
  if (await currentUser.isPasswordChanged(decodedToken.iat)) {
    return next(new AppError("Please login Again .", 401));
  }

  // All are clear
  req.user = currentUser;
  req.body.creator = req.user._id;

  next();
});

// only for render pages
exports.isLoggedIn = async (req, res, next) => {
  // Getting Token and check of is it there
  if (req.cookies.jwt) {
    try {
      // verify token
      const decodedToken = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // check if user still exists
      const currentUser = await User.findById(decodedToken.id);

      if (!currentUser) {
        return next();
      }

      // check if user Changed password after the token was issued
      if (await currentUser.isPasswordChanged(decodedToken.iat)) {
        return next();
      }

      // All are clear
      res.locals.user = currentUser;

      return next();
    } catch (error) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    // check if user role allow to do action
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  });
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user with password field
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );

  // 2) Check password
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!(await user.checkPassword(oldPassword, user.password))) {
    return next(new AppError("Password is wrong Please try again", 400));
  }

  // 3) Change Password
  user.password = newPassword;
  user.confirmPassword = confirmPassword;
  await user.save();

  // 5) sign & send new token
  createSendToken(user, 201, res);
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, "name", "email", "role");

  const ChangedUser = await User.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "updated",
    data: {
      user: ChangedUser,
    },
  });
});

exports.getAllUsers = Factory.getAll(User);
exports.getOneUser = Factory.getOne(User);
exports.deleteUser = Factory.deleteOne(User);
