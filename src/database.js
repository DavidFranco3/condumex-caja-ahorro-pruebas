const mongoose = require("mongoose");

// Credenciales para conexion local a la BD
const URI = "mongodb://127.0.0.1/caja-de-ahorro";

// Credenciales para conexion a Mongo Atlas
// const URI = "mongodb+srv://caja-de-ahorro:pVgzXxPMG2RU15Is@cluster0.dsbmu.mongodb.net/caja-de-ahorro";

mongoose.set('strictQuery', true);

mongoose.Promise = global.Promise;

mongoose
  .connect(URI)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.log("Database connection error: ", err);
  });

process.on("uncaughtException", (err, origin) => {
  console.error("Caught exception: " + err);
  console.error("Exception origin: " + origin);
});

module.exports = mongoose;
