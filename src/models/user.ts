import { model, Schema } from "mongoose";
import { IUserData } from "../types/AuthenticationTypes";

const UserSchema = new Schema<IUserData>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const UserModel = model<IUserData>("User", UserSchema);

export default UserModel;
