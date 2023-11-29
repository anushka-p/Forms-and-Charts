const router = require("express").Router();
const fs = require('fs')
const { uploads, getAvailableFiles, getChartData } = require('../controllers/chartController');

router.get('/available-files', getAvailableFiles);
router.post('/getChartData', getChartData)
const multer = require('multer');
const uploadDir = './uploads';
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }       
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), uploads); 

module.exports = router;