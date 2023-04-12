import { RequestHandler, Request } from "express";
import OpenChallengeModel from "../../models/challenges/openChallenge";
import { AuthorizedRequest } from "../../types/AuthenticationTypes";

export const getOpenChallenges: RequestHandler = async (
    req: Request<{}, {}, AuthorizedRequest>,
    res
) => {
    console.log("test");
    try {
        const response = await OpenChallengeModel.find();
        console.log(response);

        const result = response
            .filter(
                (challenge) => challenge.creator !== req.body.userData.username
            )
            .map(
                ({
                    creator,
                    creatorColor,
                    description,
                    validityTime,
                    _id,
                }) => ({
                    creator,
                    creatorColor,
                    description,
                    validityTime,
                    id: _id.toString(),
                })
            );

        console.log(result);

        return res.status(200).json(result);
    } catch (error) {
        return res
            .status(400)
            .json({ message: "Could not fetch open challenges" });
    }
};
