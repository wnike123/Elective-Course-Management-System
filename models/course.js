var mongoose = require('mongoose')

var courseSchema = new mongoose.Schema({
	"cid":String,
	"name":String,
	"dayofweek":String,
	"number":Number,
	"allow":[String],
	"teacher":String,
	"brief":String
})

var course = mongoose.model('course',courseSchema)

module.exports = course