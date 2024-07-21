const mongoose = require("mongoose");
const dotenv = require("dotenv");


dotenv.config({ path: "./config.env" });

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


const server = app.listen(process.env.PORT, () => {
  console.log("Listening to the port ", process.env.PORT);
});




