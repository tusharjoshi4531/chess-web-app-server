import { Request, RequestHandler } from "express";
import UserModel from "../../models/user";
import { ISignupRequestBody } from "../../types/AuthenticationTypes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup: RequestHandler = async (
    req: Request<{}, {}, ISignupRequestBody>,
    res
) => {
    const { username, email, password } = req.body;

    try {
        // Check if username or email already exists
        const existingUser = await UserModel.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return res.status(409).json({
                message:
                    "An account with the same username or email already exists",
            });
        }

        // Encrypting th passwords
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await UserModel.create({
            email,
            username,
            password: hashedPassword,
        });

        // Generate Token
        const token = jwt.sign(
            {
                email: result.email,
                username: result.username,
                userId: result._id,
            },
            process.env.SECRET_KEY!
        );

        res.status(201).json({ email, username, token, id: result.id });
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "something went wrong" });
    }
};

export default signup;
