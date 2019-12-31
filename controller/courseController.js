var formidable = require('formidable')
var path = require('path')
var fs = require('fs')
var mongoose = require('mongoose')
var course = require('../models/course.js')

var courseImport = (req, res) => {
	res.render('admin/course/import', {
		page: 'courseImport'
	})
}

var doCourseImport = async (req, res) => {
	await mongoose.connection.collection('courses').drop()
	var form = new formidable.IncomingForm()
	form.uploadDir = "./uploads/courseJson"
	form.keepExtensions = true
	form.parse(req, function(err, fields, files) {
		fs.readFile(files.courseJson.path,(err,data)=>{
			var dataObj = JSON.parse(data.toString()).course
			course.insertMany(dataObj).then((result)=>{
				if(result) {
					res.send('导入课程成功')
				}
			}).catch((err)=>{
				res.send('导入课程失败')
			})
		})
	})
}

var coursemanager = (req,res) => {
	res.render('admin/course/coursemanager', {
		page: 'coursemanager'
	})
}

var getCourseList = (req,res) => {
	var count = ''
	var data = ''
	var pageSize = 8
	var page = req.query.page || 1
	var findJson= {}
	var kw = req.query.kw
	if(kw && kw!='') { //模糊查询参数
		let reg = new RegExp(kw)
		findJson  = {
			$or:[
				{name:{$regex:reg}},
				{teacher:{$regex:reg}},
				{teacher:{$regex:reg}},
				{brief:{$regex:reg}}
			]
		}
	}
	course.count(findJson,(err,countData)=> {
		count = countData //总条数
		if(page<=0) {
			page = 1
		}else if(page>(count/pageSize)) {
			page = Math.ceil(count/pageSize)
		}
		course.find(findJson).sort({sid:1}).limit(pageSize).skip((page-1)*pageSize).then((coursetData) =>{
			res.send({
				status:1,
				count,
				data:coursetData,
				page
			})
		}).catch((err)=>{
			res.send({
				status:-1,
				data:'查询失败'
			})
		})
	})
}

var addCourse = (req,res)=> {
	var obj = req.body
	console.log(obj) 
	course.count({},(err,length)=> {
		obj.cid = length+1
		course.insertMany(obj).then((data)=> {
			res.send({
				status:1,
				msg:'添加成功',
				data:data
			})
		}).catch((err)=>{ console.log(err) })
	})
}

var removeCourse = (req,res) => {
	var id = req.body.id
	course.remove({_id:id}).then((data)=>{
		res.send({
			status:1,
			msg:'删除成功'
		})
	}).catch((err)=>{
		res.send({
			status:-2,
			msg:'删除失败'
		})
	})
}

var courseUpdate = (req,res) => {
	course.find({cid:req.params.cid}).then((courseData) =>{
		console.log(courseData)
		if(courseData && courseData.length) {
			res.render('admin/course/update',{
				page:'coursemanager',
				data:courseData[0]
			})
		}else {
			res.send({
				status:-1
			})
			return
		}
	}).catch((err)=>{
		res.send({
			status:-3,
			msg:'数据查询错误'
		})
		return
	})
}

var doCourseUpdate = (req,res) => {
	var arr = Object.keys(req.body)
	let key = arr[1]
	var jsonData = {}
	jsonData[key] = req.body[key]
	course.update({'_id':req.body._id},jsonData)
	.then((data) => {
		if(data) {
			res.send({
				status:0,
				data:'修改成功'
			})
		}
	})
	.catch((err)=>{console.log(err)})
}

module.exports = {
	courseImport,
	doCourseImport,
	coursemanager,
	getCourseList,
	addCourse,
	removeCourse,
	courseUpdate,
	doCourseUpdate
}