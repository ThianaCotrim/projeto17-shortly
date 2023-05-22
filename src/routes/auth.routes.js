import { Router } from "express"
import { signIn, singUp } from "../controllers/auth.controllers.js"
import { validateSchemas } from "../middlewares/validateSchema.middleware.js"
import { loginSchema, userSchema } from "../schemas/auth.schemas.js"


const authRouter = Router()

authRouter.post("/signup", validateSchemas(userSchema),singUp)
authRouter.post("/signin", validateSchemas(loginSchema),signIn)

export default authRouter