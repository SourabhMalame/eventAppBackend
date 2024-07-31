const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const express = require("express")

const app = require("./app");

const DB = process.env.DATABASE_URL

mongoose
    .connect(DB)
    .then(() => {
        console.log("DB Connected Successfully 🙅🙅");
    })
    .catch((err) => {
        console.log("Failed to connect 💥💥");
    });

app.listen(process.env.PORT, () => {
    console.log("Listening to the port ", process.env.PORT);
});
