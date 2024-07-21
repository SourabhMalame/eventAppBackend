const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./models/eventModel");
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE_URL;
mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

//Read json file

const patient = JSON.parse(
  fs.readFileSync(`${__dirname}/updated_event.json`, "utf-8")
);

//import data into database;
const importData = async () => {
  try {
    await Tour.create(patient);
    console.log("Data already loaded");
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

//Delete all data from database;

const deleteData = async () => {
  try {
    await Tour.deleteMany({});
    console.log("Data deleted Successfully");
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
