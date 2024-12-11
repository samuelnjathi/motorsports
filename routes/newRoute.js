import express from "express";
import db from "../config/db.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/",async (req, res) => {
    if (req.isAuthenticated()) {
        res.render("new.ejs", {
            heading: "Enter New Vehicle Details",
            submit: "Upload New Vehicle Details"
        });
    } else {
        res.redirect("/login");
    }
});

router.post("/", upload.array("photos", 8), (req, res, next) => {
    const {make, model, price, yom, transmission, rating, color, fuel, location, torque} = req.body;
    const carPhotos = req.files;

    try {
        db.query("INSERT INTO cars (make, model, price, yom, transmission, rating, color, fuel, location, torque) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
            [make, model, price, yom, transmission, rating, color, fuel, location, torque],
            (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).send({ message: "Error creating car entry" });
                }
                const carId = result.rows[0].id;
                const photos = [];
                carPhotos.forEach(file => {
                    const photoUrl = `/public/uploads/${file.filename}`;
                    photos.push(photoUrl);
                });  
                db.query("INSERT INTO car_photos (car_id, photo_url) VALUES ($1, $2)",
                        [carId, photos],
                        (err) => {
                            if (err) {
                                console.error(err);
                            }
                        }
                );
                res.redirect("/new");
            }
        )
    } catch (err) {
        console.error(err);
    }
});

export default router;