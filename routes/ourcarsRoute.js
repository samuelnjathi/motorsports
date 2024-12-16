import express from "express";
import cars from "../middleware/carWithPhotos.js";
import db from "../config/db.js";

const router = express.Router();

router.get("/",async (req, res) => {
    if (req.isAuthenticated()){
        try {
            const carWithPhotos = await cars();           
            res.render("ourcars.ejs", {
                cars: carWithPhotos,    
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({message: "Error retrieving cars"})
        }
    } else {
        res.redirect("/login");
    }     
});

router.get("/edit/:id",async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await db.query("SELECT * FROM cars WHERE id = $1", [id]);
        res.render("new.ejs", {
            heading: "Edit Car Details",
            submit: "Upload Edited Car Details",
            car: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error Retrieving car"})
    }
});

router.post("/edit/:id",async (req, res) => {
    const id = parseInt(req.params.id);
    const {make, model, price, yom, rating, color, location, torque} = req.body;
    try {
        await db.query("UPDATE cars SET make = $1, model = $2, price = $3, yom = $4, rating = $5, color = $6, location = $7, torque = $8 WHERE id = $9",
            [make, model, price, yom, rating, color, location, torque, id]
        );
        res.redirect("/ourcars");     
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error Uploading Edited Car Details"})
    }
});

router.get("/delete/:id",async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await db.query("DELETE FROM cars WHERE id = $1", [id]);
        res.redirect("/ourcars");
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error deleting car"})
    }
})

export default router;