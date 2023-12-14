const dbUtils = require("../../dbUtils");
const uuid = require("uuid");
const moment = require("moment");
module.exports = {
  getAllUsers: async (query, callback) => {
    try {
      dbUtils.executeQuery(query, callback);
    } catch (error) {
      console.error(error);
    }
  },
  
  createNewForm: async (body, callback) => {
    try {
      const formfieldsString = JSON.stringify(body.formControls);
      const orgid = body.originalid || 0;
      const insertQuery = `
        INSERT INTO forms(title, description, state, createdby, updatedby, version, formfields, dateprovided,status,originalid) 
        VALUES (
          '${body.title}', 
          '${body.description}', 
          '${body.state}', 
          '${body.createdby}', 
          '${body.updatedby}', 
          ${body.version}, 
          '${formfieldsString}',
          '${body.isChecked}',
          '${body.status}',
          ${orgid}             
        )
        RETURNING id;
      `;

      // Use the executeQuery function from dbUtils
      dbUtils.executeQuery(insertQuery, callback);
    } catch (e) {
      console.error(e);
    }
  },

  getSubmittedForms: async (id, callback) => {
    try {
      const query = `SELECT formid FROM submittedform WHERE submittedby = ${id}`;
      dbUtils.executeQuery(query, callback);
    } catch (err) {
      console.error(err);
    }
  },
  checkIfUserCanSubmit: (formid, userid, callback) => {
    try {
      dbUtils.getLatestSubmission(formid, userid, (err, latestSubmission) => {
        if (!latestSubmission) {
          callback(null, true); // No submission found, user is allowed to submit
          return;
        }

        const submittedAt = new Date(latestSubmission.submittedat);
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);

        const result = submittedAt < twentyFourHoursAgo;

        callback(null, result); // User is allowed to submit if true
      });
    } catch (e) {
      console.log(e);
      callback(e, null);
    }
  },

  
  getFormControlResponse: async (id, formid, submissionId, callback) => {
    try {
      if (submissionId) {
        const query = `SELECT formdata FROM submittedform WHERE submittedby = ${id} AND formid = ${formid} AND id = '${submissionId}'`;
        dbUtils.executeQuery(query, callback);
      } else {
        const query = `SELECT formdata FROM submittedform WHERE submittedby = ${id} AND formid = ${formid}`;
        dbUtils.executeQuery(query, callback);
      }
    } catch (err) {
      console.log(err);
    }
  },
  getParticularFormResponse: async (id, startdate, enddate, callback) => {
    if (!startdate && !enddate) {
      try {
        const query = `SELECT formdata FROM submittedform WHERE formid = ${id}`;
        dbUtils.executeQuery(query, callback);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        console.log(startdate, "startdate");
        const startTimestamp =
          new Date(`${startdate}T00:00:00Z`).getTime() / 1000;
        const endTimestamp = new Date(`${enddate}T23:59:59Z`).getTime() / 1000;
        console.log(startTimestamp, "start");
        const query = `
        SELECT formdata
        FROM submittedform
        WHERE formid = ${id}
        AND submittedat BETWEEN to_timestamp(${startTimestamp}) AND to_timestamp(${endTimestamp})`;
        dbUtils.executeQuery(query, callback);
      } catch (err) {
        console.log(err);
      }
    }
  },
  getFormById: async (id, callback) => {
    try {
      const query = `SELECT * FROM forms WHERE id = ${id} AND status <> 'deleted'`;
      dbUtils.executeQuery(query, callback);
    } catch (e) {
      console.log(e);
    }
  },
  getForms: async (limit, offset, callback) => {
    let query;
    if (limit !== null && offset !== null) {
      query = `SELECT * FROM forms WHERE status != 'deleted' LIMIT ${limit}  OFFSET ${offset}`;
    } else {
      query = `SELECT  COUNT(*) FROM forms WHERE status != 'deleted'`;
    }
    dbUtils.executeQuery(query, callback);
  },
  updateFormByid: (id, updatedFormData, callback) => {
    const updateQuery = `
    UPDATE forms
    SET 
        title = '${updatedFormData.title}',
        description = '${updatedFormData.description}',
        state = '${updatedFormData.state}',
        status = '${updatedFormData.status}',
        version = '${updatedFormData.version}',
        updatedat = NOW()
    WHERE id = ${id};
  `;
    dbUtils.executeQuery(updateQuery, callback);
  },

  deleteFormByid: async (id, callback) => {
    try {
      const query = `UPDATE forms SET status = 'deleted' WHERE id = ${id}`;
      await dbUtils.executeQuery(query, callback);
    } catch (e) {
      console.log(e);
    }
  },

  getCsvData: async (id, callback) => {
    try {
      const query = `SELECT formfields FROM forms WHERE id = 34`;
      dbUtils.executeQuery(query, callback);
    } catch (e) {
      console.error(e);
    }
  },
};
