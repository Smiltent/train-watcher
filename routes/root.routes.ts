
import { Router } from "express"
const router = Router()

router.get("/", (req, res) => {
    res.render("index")
})

router.get("/train", (req, res) => {
    const { train } = req.query

    res.render("view", { train })
})

export default router