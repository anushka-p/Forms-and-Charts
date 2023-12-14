const router = require("express").Router();
const { verifyToken, verifyAdmin } = require("../../middlewares/token");
const {
  getAll,
  addNewForm,
  getForm,
  updateForm,
  deleteForm,
  getSubmittedForm,
  formControlResponse,
  checkIfUserCanSubmit,
  downloadCsv,
} = require("../controllers/adminController");
router.get("/view-all", verifyToken, verifyAdmin, getAll);
router.post("/add-form", verifyToken, verifyAdmin, addNewForm);
router.post("/download-csv",verifyToken, verifyAdmin,  downloadCsv);
router.get("/form/:id", verifyToken, getForm);
router.get("/get-form/:limit/:offset", verifyToken, getForm);
// router.patch('/form/:id', verifyToken, verifyAdmin, updateForm);
router.patch("/delete-form/:formid", verifyToken, deleteForm);
router.get("/get-submitted-forms/:userid", verifyToken, getSubmittedForm); //register endpoint
router.get(
  "/get-submitted-formcontrol/:userid/:formid/:submissionId?",
  verifyToken,
  formControlResponse
);
// router.get('/get-submitted-formdate/:userid/:formid', verifyToken, formDate)
router.post("/check-ability", verifyToken, checkIfUserCanSubmit);

module.exports = router;
