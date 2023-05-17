import { Router } from "express"
import { signIn, singUp } from "../controllers/auth.controllers.js"


const authRouter = Router()

authRouter.post("/signup", singUp)
authRouter.post("/signin", signIn)

export default authRouter