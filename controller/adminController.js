var formidable = require('formidable')
var path = require('path')
var fs = require('fs')
var xlsx = require('node-xlsx') 
var Student = require('../models/student.js')
var mongoose = require('mongoose')

var index = (req, res) => {
	res.render('admin/index', {
		page: 'index'
	})
}

var student = (req, res) => {
	res.render('admin/student',{
		page:'student'
	})
}

var getStudentAll = (req,res) => {
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
				{sid:kw},
				{name:{$regex:reg}},
				{grade:{$regex:reg}}
			]
		}
	}
	Student.count(findJson,(err,countData)=> {
		count = countData //总条数
		if(page<=0) {
			page = 1
		}else if(page>(count/pageSize)) {
			page = Math.ceil(count/pageSize)
		}
		Student.find(findJson).sort({sid:1}).limit(pageSize).skip((page-1)*pageSize).then((studentData) =>{
			res.send({
				status:1,
				count,
				data:studentData,
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

var studentImport = (req, res) => {
	res.render('admin/students/import', {
		page: 'studentImport'
	})
}

var doStudentImport = async (req, res) => {
	await mongoose.connection.collection('students').drop()
	var form = new formidable.IncomingForm()
	form.uploadDir = "./uploads"
	form.keepExtensions = true
	form.parse(req, function(err, fields, files) {
		console.log(files)
		//检查是否是excel文件
		if(path.extname(files.studentexcel.name)!='.xlsx') {
			res.send('上传文件类型错误')
			fs.unlink(files.studentexcel.path,(err) => {
				if(err) {
					console.log('删除错误类型文件失败')
					return
				}
			})
			return
		}
		
		//解析excel文件内容
		const workSheetsFromFile = xlsx.parse(files.studentexcel.path)
		console.log(workSheetsFromFile)
		//检查是否包含初一到高三六个子表
		if(workSheetsFromFile.length!==6) {
			res.send('系统检测到上传的Excel表缺少子表格')
			return
		}
		
		//存储数据库
		Student.importStudent(workSheetsFromFile)
		
		//成功
		res.send('上传成功')
		
	})
}

var studentUpdate = async (req,res) => {//返回更新学生信息
	var data = await Student.getStudentById(req.params.sid)
	res.render('admin/students/update',{
		page:'student',
		data
	})
}

var doStudentUpdate = (req,res) => {//执行更新学生信息
	var arr = Object.keys(req.body)
	let key = arr[1]
	var jsonData = {}
	jsonData[key] = req.body[key]
	Student.update({'_id':req.body._id},jsonData)
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

var addStudent = (req,res) => {
	let obj = req.body
	Student.insertMany(obj).then((data)=> {
		res.send({
			status:1,
			msg:'添加成功',
			data:data
		})
	}).catch((err)=>{ console.log(err) })
}

var removeStudent = (req,res) => {
	var id = req.body.id
	Student.remove({_id:id}).then((data)=>{
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
	

module.exports = {
	index,
	student,
	getStudentAll,
	studentImport,
	doStudentImport,
	studentUpdate,
	doStudentUpdate,
	addStudent,
	removeStudent
}
