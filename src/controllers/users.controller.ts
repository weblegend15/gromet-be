import { Request, Response } from "express";
import Cart from "../models/cart";
import { StatusCodes } from "http-status-codes";
import Product from "../models/product";
import User from "../models/user";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const all_users = await User.find();
    return res.status(StatusCodes.OK).json({ data: all_users });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
};

const DeleteAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await Cart.deleteMany({ roles: "USER" });
    return res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
};

const DeleteUserByID = async (req: Request, res: Response) => {
  try {
    const { selected } = req.body;
    console.log(selected);
    const result = await User.findOneAndDelete({
      _id: selected,
    });
    return res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
};

const VerifyPhoneById = async (req: Request, res: Response) => {
  try {
    const { selected } = req.body;
    const result: any = await User.findOneAndUpdate(
      {
        _id: selected,
      },
      { $set: { isPhoneVerified: true } },
      { new: true }
    );
    return res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
};

const usersController = {
  DeleteAllUsers,
  getAllUsers,
  DeleteUserByID,
  VerifyPhoneById,
};

export default usersController;
