import { Router } from "express";
import login from "../controllers/authentication/login";
import signup from "../controllers/authentication/signup";

const authenticationRouter = Router()

authenticationRouter.post("/login", login)
authenticationRouter.post("/signup", signup)

export default authenticationRouter