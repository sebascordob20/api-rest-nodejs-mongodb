const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema(
    {
        title: String,
        author: String,
        genero: String,
        publicationDate: String,  
    }
)

module.exports = mongoose.model('Book', bookSchema);
//module.exports = bookSchema;