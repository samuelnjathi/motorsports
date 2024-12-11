import db from "../config/db.js";

async function cars() {
    const result = await db.query("SELECT * FROM cars");
    const cars = result.rows;
    const carPhotos = await Promise.all(cars.map(async car => {
        const result = await db.query("SELECT photo_url FROM car_photos WHERE car_id = $1", [car.id]);
        return result.rows.map(row => row.photo_url)
    }));
        
    const carWithPhotos = cars.map((car, index) => ({
        ...car,
        photos: carPhotos[index]
    }));
    return carWithPhotos;
   
}

export default cars;

