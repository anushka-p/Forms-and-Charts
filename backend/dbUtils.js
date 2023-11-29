const client = require('../backend/connection');

// Function to execute a database query
const executeQuery = (query, callback) => {
  client.query(query, (error, result) => {
    if (error) {
      return callback(error);
    }
    return callback(null, result);
  });
};

const getLatestSubmission = (formid, userid, callback) => {
  const query = `
    SELECT *
    FROM submittedform
    WHERE formid = $1
      AND submittedby = $2
    ORDER BY submittedat DESC
    LIMIT 1;
  `;

  client.query(query, [formid, userid], (error, result) => {
    if (error) {
      // Handle error
      console.log(error);
      return callback(error);
    }

    const latestSubmission = result.rows[0];
    callback(null, latestSubmission);
  });
};

module.exports = { executeQuery, getLatestSubmission };
