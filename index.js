import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import bcrypt from "bcrypt";
import { Strategy } from 'passport-local';
import homeRoute from "./routes/homeRoute.js";
import newRoute from "./routes/newRoute.js";
import ourcarsRoute from "./routes/ourcarsRoute.js";
import detailRoute from "./routes/detailRoute.js";
import db from "./config/db.js";
import env from "dotenv";

const app = express();
const PORT = 3000;
const saltRounds = 10;
env.config();

app.use(session({
    secret: process.env.TOPSECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 24 * 24 * 60}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use("/", homeRoute);

app.use("/detail", detailRoute);

app.use("/new", newRoute);

app.use("/ourcars", ourcarsRoute);

// Login
app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/ourcars",
    failureRedirect: "/login",
}));

// Logout 
app.get("/logout", (req, res) => {
    req.logout(err => {
        if (err) {
          return next(err)  
        }
        res.redirect("/new");
    });
});

//Register
app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.post("/register",async (req, res) => {
 const { fname, lname, username, password, confirmPassword } = req.body;

 if (password === confirmPassword) {
    try {
        const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [username]);

        if (checkResult.rows.length > 0) {
            res.status(400).send({message: "Username already exists"});
        } else {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.error(err);
                } else {
                    const result = await db.query(
                        "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
                    [fname, lname, username, hash]);
                    const user = result.rows[0];
                    req.login(user, (err) => {
                        console.log(err);
                        res.redirect("/ourcars");
                    });
                }
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error retrieving user details"});
    }
 } else {
    console.log("Passwords do NOT match");
 }
});

//Reset Password
app.get("/password", (req, res) => {
    res.render("password.ejs");
});

passport.use("local", new Strategy(async function verify(username, password, cb) {
    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [username]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const storedHashPassword = user.password;
            bcrypt.compare(password, storedHashPassword, (err, result) => {
                if (err) {
                    return cb(err);
                } else {
                    if (result) {
                        return cb(null, user);
                    } else {
                        return cb(null, false);
                    }
                }
            });
        } else {
            return cb("User NOT found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error retrieving user details"});
    }
}));

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})