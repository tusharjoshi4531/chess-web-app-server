import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { IUserData } from "../types/AuthenticationTypes";

export const authorizeToken: RequestHandler = (req, res, next) => {
    // console.log("test");
    const authHeader = req.header("Authorization");

    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
        return res.status(401).json({ message: "Couldn't find JSON webtoken" });

    jwt.verify(token, process.env.SECRET_KEY!, (err, user) => {
        if (err)
            return res.status(403).json({ message: "Invalid JSON webtoken" });

        req.body.userData = user as IUserData;
        return next();
    });
};
