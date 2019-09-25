var formidable = require('formidable')
var path = require('path')
var fs = require('fs')
var xlsx = require('node-xlsx') 

var index = (req, res) => {
	res.render('admin/index', {
		page: 'index'
	})
}

var student = (req, res) => {
	res.render('admin/student', {
		page: 'student'
	})
}

var studentImport = (req, res) => {
	res.render('admin/students/import', {
		page: 'studentImport'
	})
}

var doStudentImport = (req, res) => {
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
		
		//检查文件内容是否正确
		const workSheetsFromFile = xlsx.parse(files.studentexcel.path)
		console.log(workSheetsFromFile)
		//检查是否包含初一到高三六个子表
		if(workSheetsFromFile.length!==6) {
			res.send('系统检测到上传的Excel表缺少子表格')
			return
		}
		
		
	})
}

module.exports = {
	index,
	student,
	studentImport,
	doStudentImport
}
