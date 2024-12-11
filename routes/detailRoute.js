import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/:id",async (req, res) => {
    const id = parseInt(req.params.id, 10);
   
    if (Number.isInteger(id)){
        try {
           const result = await db.query("SELECT * FROM cars WHERE id = $1", [id]);
           const car = result.rows[0];
           const results = await db.query("SELECT photo_url FROM car_photos WHERE car_id = $1", [car.id]);
           const carPhotos = results.rows[0].photo_url;
        //    console.log(carPhotos[0]);
           res.render("detail.ejs", {car, carPhotos});
        } catch (err) {
            console.error(err);
            res.status(500).send({message: "Error retrieving specific car"})
        }
    } else {
        console.log("Invalid Id", id);
        res.status(400).send({message: "Invalid Id"})
    }
    
    
});

export default router;