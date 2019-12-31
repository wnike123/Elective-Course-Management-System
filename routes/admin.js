var express = require('express');
var router = express.Router();
var adminController = require('../controller/adminController.js')
var studentController = require('../controller/studentController.js')
var courseController = require('../controller/courseController.js')

/* GET users listing. */
router.get('/', adminController.index);
/* 处理学生相关 */
router.get('/student', studentController.student);
router.get('/student/getStudentAll', studentController.getStudentAll);
router.get('/student/import', studentController.studentImport);
router.post('/student/import', studentController.doStudentImport);
router.get('/student/update/:sid', studentController.studentUpdate);
router.post('/student/update', studentController.doStudentUpdate);
router.post('/student/add', studentController.addStudent);
router.post('/student/remove', studentController.removeStudent);
router.get('/student/export', studentController.exportStuduent)
/* 处理课程相关 */
router.get('/course/import', courseController.courseImport);
router.post('/course/import', courseController.doCourseImport);
router.get('/coursemanager', courseController.coursemanager);
router.get('/course/getCourseList', courseController.getCourseList);
router.post('/course/addCourse', courseController.addCourse);
router.post('/course/remove', courseController.removeCourse);
router.get('/course/update/:cid', courseController.courseUpdate);
router.post('/course/update', courseController.doCourseUpdate);

module.exports = router;
