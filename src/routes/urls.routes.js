import { Router } from "express";
import { insertShortUrl } from "../controllers/urls.controllers.js";


const urlRouter = Router()

urlRouter.post("/urls/shorten", insertShortUrl)
urlRouter.get("/urls/:id")
urlRouter.get("/urls/open/:shortUrl")
urlRouter.delete("/urls/:id")

export default urlRouter