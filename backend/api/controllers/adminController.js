const adminServices = require("../services/adminServices");
const util = require("util");

const getAll = async (req, res) => {
  try {
    const { sortBy, state, role, limit, offset, username } = req.query;

    // Build the base SQL query
    let query = "SELECT * FROM users";
    let countQuery = "SELECT COUNT(*) FROM users"; // New query to count total items
    let conditions = [];

    // Add conditions if parameters are provided
    if (state) {
      conditions.push(`state = '${state}'`);
    }

    if (role) {
      conditions.push(`role = '${role}'`);
    }
    if (username) {
      conditions.push(`username LIKE '%${username}%'`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
      countQuery += " WHERE " + conditions.join(" AND ");
    }

    if (sortBy) {
      const [field, order] = sortBy.split(":");
      query += ` ORDER BY ${field} ${order === "desc" ? "DESC" : "ASC"}`;
    }

    // Add pagination
    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    if (offset) {
      query += ` OFFSET ${offset}`;
    }

    // Get total items count
    await adminServices.getAllUsers(countQuery, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Connection error" });
      }
      const totalItems = results.rows[0].count;

      // Retrieve paginated data
      adminServices.getAllUsers(query, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Connection error" });
        }
        const data = results.rows.map((user) => {
          const { password, ...rest } = user;
          return rest;
        });

        return res.status(200).json({
          data,
          totalItems,
        });
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: "Database connection error...",
    });
  }
};

const getSubmittedForm = async (req, res) => {
  try {
    const id = req.params.userid;
    await adminServices.getSubmittedForms(id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Database connection error" });
      }
      return res.status(200).json({
        data: results.rows,
        message: "Retrieved successfully",
      });
    });
  } catch (err) {
    throw err;
  }
};

const checkIfUserCanSubmit = async (req, res) => {
  const { id, formid } = req.body;
   adminServices.checkIfUserCanSubmit(
    formid,
    id,
    (err, allowedToSubmit) => {
      if (!err) {
        if (allowedToSubmit) {
          return res.status(200).json({ allowedToSubmit: true });
        } else {
          return res.status(200).json({ allowedToSubmit: false });
        }
      }
    }
  );
};

const formControlResponse = async (req, res) => {
  try {
    const id = req.params.userid;
    const formid = req.params.formid;
    const submissionId = req.params.submissionId;
    if (submissionId) {
      await adminServices.getFormControlResponse(
        id,
        formid,
        submissionId,
        (err, results) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ message: "Database connection error" });
          }
          return res.status(200).json({
            data: results.rows,
            message: "Retrieved successfully",
          });
        }
      );
    } else {
      await adminServices.getFormControlResponse(
        id,
        formid,
        undefined,
        (err, results) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ message: "Database connection error" });
          }
          return res.status(200).json({
            data: results.rows,
            message: "Retrieved successfully",
          });
        }
      );
    }
  } catch (err) {
    throw err;
  }
};
const addNewForm = async (req, res) => {
  try {
    await adminServices.createNewForm(req.body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Database connection error.......",
        });
      }
      return res.status(200).json({
        data: results,
        message: "Form created.",
      });
    });
  } catch (e) {
    console.log(e);
  }
};

const getForm = async (req, res) => {
  try {
    const id = await req.params.id;
    if (id) {
      await adminServices.getFormById(id, (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Database connection error" });
        }
        if (results.rows.length === 0) {
          return res.status(404).json({ message: "form not found" });
        }
        return res.status(200).json({
          data: results.rows[0],
        });
      });
    } else {
      const limit = req.params.limit;
      const offset = req.params.offset;
      await adminServices.getForms(limit, offset, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Database connection error" });
        }
        let totalItems;
        const data = results.rows.map((form) => {
          const { formfields, ...rest } = form;
          return rest;
        });
        adminServices.getForms(null, null, (err, result) => {
          if (err) {
            console.log(err);
            return;
          }
          totalItems = result.rows[0].count;
          return res.status(200).json({
            data,
            totalItems,
          });
        });
      });
    }
  } catch (e) {
    console.log(e);
  }
};

const updateForm = async (req, res) => {
  try {
    const id = req.params.id;
    //to check if a user exists or not and then update
    await adminServices.getFormById(id, (err, results) => {
      if (results.rows.length === 0) {
        return res.status(404).json({ message: "Form not found" });
      }
      const updatedFormData = req.body;
      adminServices.updateFormByid(id, updatedFormData, (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Database connection error" });
        }
        return res.status(200).json({ message: "Form updated successfully" });
      });
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteForm = async (req, res) => {
  try {
    const id = req.params.formid;
    await adminServices.getFormById(id, (err, results) => {
      if (results.rows.length === 0) {
        return res.status(404).json({ message: "Form not found" });
      }

      // If the form exists, proceed with deletion
      adminServices.deleteFormByid(id, (err, results) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        return res.status(200).json({
          message: "Form deleted successfully",
        });
      });
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getFormByIdAsync = util.promisify(adminServices.getFormById);
const getParticularFormResponseAsync = util.promisify(
  adminServices.getParticularFormResponse
);

//optimization needed
const downloadCsv = async (req, res) => {
  try {
    const formid = req.body.id;
    const startdate = req.body.startDate;
    const enddate = req.body.endDate;

    const formStructureResponse = await getFormByIdAsync(formid);
    const formStructure = formStructureResponse.rows[0].formfields.controls;
    const formResponsesResponse = await getParticularFormResponseAsync(
      formid,
      startdate,
      enddate
    );
    const formResponses = formResponsesResponse.rows;
    const controlMap = {};
    formStructure.forEach((control) => {
      const controlId = control.id;
      const controlType = control.type;
      if (controlType === "radio" || controlType === "dropdown") {
        const options = control.options.reduce((acc, option) => {
          acc[option.id] = option.value;
          return acc;
        }, {});
        controlMap[controlId] = options;
      } else if (controlType === "checklist") {
        controlMap[controlId] = control.options.map((option) => option.value);
      } else {
        controlMap[controlId] = null;
      }
    });
    const csvData = formResponses.map((response) => {
      const formData = response.formdata;
      const rowData = formStructure.map((control) => {
        const controlId = control.id;
        const controlType = control.type;
        const controlKey = `${controlId} - ${control.label}`;

        if (controlType === "radio" || controlType === "dropdown") {
          const selectedId = formData[controlKey];
          return controlMap[controlId][selectedId] || "";
        } else if (controlType === "checklist") {
          const selectedIds = formData[controlKey];
          if (Array.isArray(selectedIds)) {
            return controlMap[controlId].join(",");
          } else {
            return "";
          }
        } else {
          return formData[controlKey] || "";
        }
      });
      return rowData.join(",");
    });
    // console.log(controlMap, "controlmap2");
    const csvHeading = formStructure.map((control) => control.label);
    csvData.unshift(csvHeading.join(","));
    const csvString = csvData.join("\n");
    res.send(csvString);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  getAll,
  addNewForm,
  getForm,
  updateForm,
  deleteForm,
  getSubmittedForm,
  formControlResponse,
  checkIfUserCanSubmit,
  downloadCsv,
};
