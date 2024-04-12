import mongoose, { Document, Schema, Model } from "mongoose";
import { Roles } from "../enums/roles.enums";

export interface IUser extends Document {
  // name: string;
  email: string;
  isEmailVerified: boolean;
  password: string;
  roles: string;
}

export interface IUserModel extends Model<IUser> {}

const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      enum: Roles,
      required: true,
      default: Roles.DEFAULT,
    },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
  },
});

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
