import express from "express";
import cars from "../middleware/carWithPhotos.js";

const router = express.Router();

router.get("/",async (req, res) => {
    const carWithPhotos = await cars();
    const photo = carWithPhotos[0].photos[0][0].replace("/public", "");
    console.log(carWithPhotos.photos);
    try {
        res.render("index.ejs", {
            cars: carWithPhotos,
            photo: photo
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error retrieving cars"})
    }
    
});

export default router;