import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from 'path';

import User from "../models/user";
import {
  secretKey,
  appname,
  frontendBaseUrl,
  frontendBaseVerificationUrl,
} from "../config";
import { sendEmail } from "../utils/sendEmail";
import Token from "../models/token";

const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) res.status(400).send();

    const user = new User({
      username: username,
      email: email,
      password: bcrypt.hashSync(password, 8),
    });
    await user.save();

    res.status(202).send();
    sendEmail({
      email,
      subject: "Verification",
      template: "verificationEmailTemplate.ejs",
      compiledTemplateData: {
        appname: appname,
        verificationType: "signup",
        buttonName: "Verify",
        verifyurl: `${frontendBaseVerificationUrl}?id=${user.id}`,
        actiontype: "verification",
        appbaseurl: frontendBaseUrl,
      },
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};


const login = async (req: Request, res: Response) => {

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send();
    }

    const isPwdValid = bcrypt.compareSync(password, user.password);
    if (!isPwdValid) {
      return res.status(400).send();
    }
    if (!user.isEmailVerified) {
      res.status(202).send();
      await sendEmail({
        email,
        subject: "Verification",
        template: "verificationEmailTemplate.ejs",
        compiledTemplateData: {
          appname: appname,
          verificationType: "login",
          buttonName: "Verify",
          verifyurl: `${frontendBaseVerificationUrl}?id=${user.id}`,
          actiontype: "verification",
          appbaseurl: frontendBaseUrl,
        },
      });
      return;
    }

    const token = jwt.sign(
      { id: user.id, },
      secretKey,
      { algorithm: "HS256", expiresIn: "7d" }
    );

    return res.status(200).json({ accessToken: token, data: user });
  } catch (err) {
    return res.status(500).send();
  }
};


const fetchMe = async (req: Request, res: Response) => {
  // const email = req.body?.decoded?.email;
  const { user_id } = req.body;
  try {
    const user = await User.findOne({ _id: user_id });
    console.log(user, user_id);

    return res.status(StatusCodes.OK).json(user);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user)
      return res.status(400).send("User with given email doesn't exist");

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: jwt.sign(
          {
            email: email,
          },
          secretKey,
          { algorithm: "HS256" }
        ),
      }).save();
    }

    const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;

    await sendEmail({
      email,
      subject: "Password reset",
      template: "verificationEmailTemplate.ejs",
      compiledTemplateData: {
        appname: appname,
        verificationType: "password-reset",
        buttonName: "Reset Password",
        verifyurl: link,
        actiontype: "password-reset",
        appbaseurl: frontendBaseUrl,
      },
    });

    res.send("Password reset link sent to your email account");
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
};

const verifyUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    await User.findOneAndUpdate(
      { _id: id },
      { isEmailVerified: true },
      { new: true }
    );
    return res.status(StatusCodes.OK).sendFile(path.join(__dirname, '../templates/verificationWebTemplate.html'));
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
};

const resetPassword = async (req: Request, res: Response) => {
  const { id } = req.query;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { isEmailVerified: true },
      { new: true }
    );

    return res.status(StatusCodes.OK).json(updatedUser);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
};

const authController = {
  signup,
  login,
  forgotPassword,
  fetchMe,
  verifyUserById,
  resetPassword,
};

export default authController;
