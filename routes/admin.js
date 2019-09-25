var express = require('express');
var router = express.Router();
var adminController = require('../controller/adminController.js')

/* GET users listing. */
router.get('/', adminController.index);
router.get('/student', adminController.student);
router.get('/student/import', adminController.studentImport);
router.post('/student/import', adminController.doStudentImport);

module.exports = router;
