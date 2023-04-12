import { Router } from "express";
import { createOpenChallenge } from "../controllers/challenge/create-challenge";
import { getOpenChallenges } from "../controllers/challenge/get-challenge";
import { removeOutdatedOpenChallenged } from "../controllers/challenge/remove-outdated-challenges";
import { authorizeToken } from "../middleware/authorization";

const challengeRouter = Router();

challengeRouter.use(authorizeToken);
challengeRouter.use(removeOutdatedOpenChallenged);
challengeRouter.post("/open", createOpenChallenge);
challengeRouter.get("/open", getOpenChallenges);

export default challengeRouter;
