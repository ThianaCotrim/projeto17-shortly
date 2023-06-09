import { Router } from "express"
import authRouter from "./auth.routes.js"
import urlRouter from "./urls.routes.js"
import usersRouter from "./users.routes.js"
import rankingRouter from "./ranking.routes.js"


const router = Router()
router.use(authRouter)
router.use(urlRouter)
router.use(usersRouter)
router.use(rankingRouter)

export default router