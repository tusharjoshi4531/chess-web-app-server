import { Request, RequestHandler } from "express";
import OpenChallengeModel from "../../models/challenges/openChallenge";
import { removeOutdatedChallengesFromDatabase } from "../../models/challenges/remove-outdated-challenges";
import { AuthorizedRequest } from "../../types/AuthenticationTypes";

export const removeOutdatedOpenChallenged: RequestHandler = async (
    _: Request<{}, {}, AuthorizedRequest>,
    res,
    next
) => {
    try {
        await removeOutdatedChallengesFromDatabase();
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Something went wrong while deleting challenges",
        });
    }
};
