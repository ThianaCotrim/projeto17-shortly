import { Router } from "express";
import { deleteUrlId, getOpenUrl, getUrlId, insertShortUrl } from "../controllers/urls.controllers.js";
import { validateSchemas } from "../middlewares/validateSchema.middleware.js";
import { urlSchema } from "../schemas/url.schemas.js";


const urlRouter = Router()

urlRouter.post("/urls/shorten", validateSchemas(urlSchema),insertShortUrl)
urlRouter.get("/urls/:id", getUrlId)
urlRouter.get("/urls/open/:shortUrl", getOpenUrl)
urlRouter.delete("/urls/:id", deleteUrlId)

export default urlRouter