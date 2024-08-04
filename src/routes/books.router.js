const express = require("express");
//const bookSchema = require('../models/books.model')
const Book = require("../models/books.model");
const router = express.Router();

//Validar con un middleware
const getBookMiddleware = async (req, res, next) => {
  let libro;
  const { id } = req.params;
  //expresion regular para identificar un id de mongo.
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Error. ID invalido" });
  }

  try {
    libro = await Book.findById(id);
    if (!libro) {
      return res.status(404).json({ message: "No se ha encontrado el libro." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.libro = libro;
  next();
};

//Consultar todos los libros del modelo.
router.get("/", async (req, res) => {
  try {
    const allBooks = await Book.find();
    if (allBooks.length == 0) {
      return res.status(204).json([]);
    }
    res.json(allBooks);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

router.get("/:id", getBookMiddleware, async (req, res) => {
  res.json(res.libro);
});

router.post("/", async (req, res) => {
  const { title, author, genero, publicationDate } = req?.body;
  if (!title || !author || !genero || !publicationDate) {
    return res
      .status(400)
      .json({ message: "Es obligatorio enviar todos los campos requeridos" });
  }

  const book = new Book({ title, author, genero, publicationDate });

  try {
    //Creando una instancia del modelo books  de la base de datos de mongo.
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", getBookMiddleware, async (req, res) => {
  try {
    //extrayendo la informacion actual del libro que queremos actualizar.
    const libro = res.libro;
    libro.title = req.body.title || libro.title;
    libro.author = req.body.author || libro.author;
    libro.genero = req.body.genero || libro.genero;
    libro.publicationDate = req.body.publicationDate || libro.publicationDate;

    //Guardamos los cambios del libro en la base de datos.
    libroActualizado = await libro.save();

    //Devolvemos la información del libro actualizada
    res.json(libroActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id", getBookMiddleware, async (req, res) => {
  if (
    !req.body.title &&
    !req.body.author &&
    !req.body.genero &&
    !req.body.publicationDate
  ) {
    res
      .status(400)
      .json({
        message:
          "Debe enviar almenos un atributo del libro, ya sea title, author, genero o publicationDate para actualizar",
      });
  }
  try {
    //extrayendo la informacion actual del libro que queremos actualizar.
    const libro = res.libro;
    libro.title = req.body.title || libro.title;
    libro.author = req.body.author || libro.author;
    libro.genero = req.body.genero || libro.genero;
    libro.publicationDate = req.body.publicationDate || libro.publicationDate;

    //Guardamos los cambios del libro en la base de datos.
    libroActualizado = await libro.save();

    //Devolvemos la información del libro actualizada
    res.json(libroActualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Borrar un libro específico
router.delete("/:id", getBookMiddleware, async (req, res) => {
  try {
    const libro = res.libro;
    await libro.deleteOne({
      _id: libro._id,
    });
    res
      .status(202)
      .json({ message: `El libro ${libro.title} fue borrado con éxito` });
    S;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
