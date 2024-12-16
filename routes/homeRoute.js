import express from "express";
import cars from "../middleware/carWithPhotos.js";

const router = express.Router();

router.get("/",async (req, res) => {
    const carWithPhotos = await cars();
    try {
        res.render("index.ejs", {
            cars: carWithPhotos,
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error retrieving cars"})
    }
    
});

export default router;