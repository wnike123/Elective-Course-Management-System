var express = require('express');
var router = express.Router();
var adminController = require('../controller/adminController.js')

/* GET users listing. */
router.get('/', adminController.index);
router.get('/student', adminController.student);
router.get('/student/getStudentAll', adminController.getStudentAll);
router.get('/student/import', adminController.studentImport);
router.post('/student/import', adminController.doStudentImport);
router.get('/student/update/:sid', adminController.studentUpdate);
router.post('/student/update', adminController.doStudentUpdate);
router.post('/student/add', adminController.addStudent);
router.post('/student/remove', adminController.removeStudent);

module.exports = router;
