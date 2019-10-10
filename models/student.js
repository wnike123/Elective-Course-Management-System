var mongoose = require('mongoose')

var studentSchema = new mongoose.Schema({
	'sid':Number,//学号
	'name':String,//姓名
	'password':String,//密码
	'grade':String,//年级
	'initPs':{type:Boolean,default:true} //是否初始密码，初始true，改过false
})

//导入学生
studentSchema.statics.importStudent= (workSheetsFromFile) => {
	var gradeArr = ['初一','初二','初三','高一','高二','高三']
	for(var i=0;i<workSheetsFromFile.length;i++) {
		for(var j=1;j<workSheetsFromFile[i].data.length;j++) {
			if(workSheetsFromFile[i].data[j].length!=0) {
				var s = new Student({
					'sid':workSheetsFromFile[i].data[j][0],
					'name':workSheetsFromFile[i].data[j][1],
					'grade':gradeArr[i],
					'password':Math.random().toString(16).substring(2,6) //随机六位数字初始密码
				})
				s.save()
			}
		}
	}
}

//getStudentById
studentSchema.statics.getStudentById = (sid) => {
	return Student.findOne({sid}).then((data) => {
		if(data!={}) {
			return data
		}else {
			return '查无此人'
		}
	})
}

var Student = mongoose.model('student',studentSchema)

module.exports = Student