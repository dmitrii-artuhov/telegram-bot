const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WatchListSchema = new Schema({
	userId: String,
	movielist: {
		type: Array,
		default: []
	}
});

module.exports = WatchList = mongoose.model('WatchList', WatchListSchema);