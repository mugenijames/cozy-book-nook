import { Router } from "express"
import * as controller from "../controllers/book.controller"

const router = Router()

router.get("/", controller.getAllBooks)
router.get("/:id", controller.getBook)
router.post("/", controller.createBook)
router.put("/:id", controller.updateBook)
router.delete("/:id", controller.deleteBook)

export default router