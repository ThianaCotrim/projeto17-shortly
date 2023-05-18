import { Router } from "express";
import { getOpenUrl, getUrlId, insertShortUrl } from "../controllers/urls.controllers.js";


const urlRouter = Router()

urlRouter.post("/urls/shorten", insertShortUrl)
urlRouter.get("/urls/:id", getUrlId)
urlRouter.get("/urls/open/:shortUrl", getOpenUrl)
urlRouter.delete("/urls/:id")

export default urlRouter