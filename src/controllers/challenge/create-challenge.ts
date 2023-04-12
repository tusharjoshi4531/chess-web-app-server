import { Request, RequestHandler } from "express";
import OpenChallengeModel from "../../models/challenges/openChallenge";
import { ICreateOpenChallengeRequestBody } from "../../types/Challenge";

export const createOpenChallenge: RequestHandler = async (
    req: Request<{}, {}, ICreateOpenChallengeRequestBody>,
    res
) => {
    const { userData, creatorColor, description, validityTime } = req.body;

    try {
        await OpenChallengeModel.create({
            creator: userData.username,
            creatorColor,
            description,
            validityTime,
        });

        return res.status(200).json({ message: "successfull" });
    } catch (err) {}
};
