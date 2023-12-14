const router = require("express").Router();
const {verifyToken, verifyUser} = require('../../middlewares/token');
const {getUser, updateUser, deleteUser, addNewUserFormSubmission, otherFormSubmission} = require('../controllers/userController');
router.get('/get-user/:id', verifyToken, getUser);
router.patch('/update-user/:id',verifyToken,updateUser);
router.delete('/delete/:id',verifyToken,deleteUser)
router.post("/submit-new-form/:id", verifyToken, addNewUserFormSubmission);
router.get("/other-submissions/:id/:userid", verifyToken, otherFormSubmission);

module.exports=router;