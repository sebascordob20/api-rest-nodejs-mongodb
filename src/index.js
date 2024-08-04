const express = require("express");
//const {config} = require('dotenv');
require("dotenv").config();
const mongoose = require("mongoose");
const booksRoutes = require("./routes/books.router");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

//Conectandose a la base de datos.
mongoose
  .connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB", err));

//Accediendo a una instancia de la base de datos.
const databaseMongo = mongoose.connection;

app.use("/books", booksRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor web corriendo en http://localhost:${PORT}`);
});
