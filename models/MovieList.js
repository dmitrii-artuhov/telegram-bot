const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieListSchema = new Schema({
	userId: String,
	movies: Array
});

module.exports = MovieList = mongoose.model('MovieList', MovieListSchema);