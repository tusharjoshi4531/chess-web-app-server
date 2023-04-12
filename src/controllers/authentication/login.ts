import { Request, RequestHandler } from "express";
import UserModel from "../../models/user";
import { ILoginRequestBody } from "../../types/AuthenticationTypes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

console.log(process.env);

export const login: RequestHandler = async (
    req: Request<{}, {}, ILoginRequestBody>,
    res
) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const existingUser = await UserModel.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Match credentials
        const matchPassword = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!matchPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate token
        const token = jwt.sign(
            {
                email: existingUser.email,
                username: existingUser.username,
                userId: existingUser._id,
            },
            process.env.SECRET_KEY!
        );

        res.status(200).json({
            email,
            username: existingUser.username,
            token,
            userId: existingUser._id,
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "something went wrong" });
    }
};

export default login;
