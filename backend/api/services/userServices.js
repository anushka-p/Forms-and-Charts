const dbUtils = require("../../dbUtils");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
module.exports = {
  getUserByid: async (id, callback) => {
    try {
      const query = `SELECT * FROM users WHERE id = ${id}`;
      dbUtils.executeQuery(query, callback);
    } catch (e) {
      console.error(e);
    }
  },

  updateUserByid: (id, updatedUserData, callback) => {
    let updateQuery = `
          UPDATE users
          SET
        `;
    const fieldUpdates = [];
    if (updatedUserData.username) {
      fieldUpdates.push(`username = '${updatedUserData.username}'`);
    }
    if (updatedUserData.useremail) {
      fieldUpdates.push(`useremail = '${updatedUserData.useremail}'`);
    }
    if (updatedUserData.state) {
      fieldUpdates.push(`state = '${updatedUserData.state}'`);
    }
    if (updatedUserData.role) {
      fieldUpdates.push(`role = '${updatedUserData.role}'`);
    }
    if (updatedUserData.updatedby) {
      fieldUpdates.push(`updatedby = '${updatedUserData.updatedby}'`);
    }
    if (updatedUserData.password) {
      bcrypt.hash(updatedUserData.password, 10, (err, hashedPassword) => {
        if (err) {
          return callback(err);
        }
        fieldUpdates.push(`password = '${hashedPassword}'`);
        updateQuery += fieldUpdates.join(", ") + ` WHERE id = ${id};`;
        dbUtils.executeQuery(updateQuery, callback);
      });
    } else {
      if (fieldUpdates.length === 0) {
        return callback({ message: "No fields provided for update." }, null);
      }
      updateQuery += fieldUpdates.join(", ") + ` WHERE id = ${id};`;
      dbUtils.executeQuery(updateQuery, callback);
    }
  },
  deleteUserByid: (id, callback) => {
    try {
      const query = `DELETE FROM users WHERE id = ${id}`;
      dbUtils.executeQuery(query, callback);
    } catch (e) {
      console.error(e);
    }
  },
  createNewFormSubmission: async (body, callback) => {
    try {
      const submittedResponseString = JSON.stringify(body.formresponse);
      const submittedat = new Date();
      const timestamp = `${submittedat.getFullYear()}-${String(
        submittedat.getMonth() + 1
      ).padStart(2, "0")}-${String(submittedat.getDate()).padStart(
        2,
        "0"
      )} ${String(submittedat.getHours()).padStart(2, "0")}:${String(
        submittedat.getMinutes()
      ).padStart(2, "0")}:${String(submittedat.getSeconds()).padStart(2, "0")}`;
      const id = uuid.v4();
      const insertQuery = `
      INSERT INTO submittedform(id, formdata, submittedby, submittedat, formid)
      VALUES (
        '${id}',
        '${submittedResponseString}',
        '${body.submittedby}',
        '${timestamp}',
        '${body.formid}'
      )RETURNING id;`;

      dbUtils.executeQuery(insertQuery, (err, result) => {
        if (err) {
          console.error("Error executing query:", err);
          return callback(err);
        }
        callback(null, result);
      });
    } catch (err) {
      console.error("Error:", err);
    }
  },
  getOtherFormSubmission: async (id, userid, callback) => {
    try {
      const query = `SELECT submittedat,submittedby,formid,id FROM submittedform WHERE formid = ${id} AND submittedby = ${userid}`;
      await dbUtils.executeQuery(query, callback);
    } catch (err) {
      console.log(err);
    }
  },
};
