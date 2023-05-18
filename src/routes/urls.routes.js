import { Router } from "express";
import { getUrlId, insertShortUrl } from "../controllers/urls.controllers.js";


const urlRouter = Router()

urlRouter.post("/urls/shorten", insertShortUrl)
urlRouter.get("/urls/:id", getUrlId)
urlRouter.get("/urls/open/:shortUrl")
urlRouter.delete("/urls/:id")

export default urlRouter