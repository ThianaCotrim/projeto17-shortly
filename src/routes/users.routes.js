import { Router } from "express";
import { getDadosUsuario } from "../controllers/users.controllers.js";


const usersRouter = Router()

usersRouter.get("/users/me", getDadosUsuario)

export default usersRouter