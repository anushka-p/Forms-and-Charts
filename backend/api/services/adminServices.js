const dbUtils = require('../../dbUtils');
const uuid = require('uuid');
const moment = require('moment');
module.exports= {
  getAllUsers: async (query, callback) => {
    try {
      dbUtils.executeQuery(query, callback);
    } catch (error) {
      throw error;
    }
  },
  createNewFormSubmission: async (body, callback)=>{
    try{
      const submittedResponseString = JSON.stringify(body.formresponse);
      const submittedat = new Date();
      const timestamp = `${submittedat.getFullYear()}-${String(submittedat.getMonth() + 1).padStart(2, '0')}-${String(submittedat.getDate()).padStart(2, '0')} ${String(submittedat.getHours()).padStart(2, '0')}:${String(submittedat.getMinutes()).padStart(2, '0')}:${String(submittedat.getSeconds()).padStart(2, '0')}`;
      const id = uuid.v4();
      const insertQuery = `
      INSERT INTO submittedform(id, formdata, submittedby, submittedat, formid)
      VALUES (
        '${id}',
        '${submittedResponseString}',
        '${body.submittedby}',
        '${timestamp}',
        '${body.formid}'
      )RETURNING id;`

      dbUtils.executeQuery(insertQuery, (err, result) => {
        if (err) {
          console.error('Error executing query:', err);
          return callback(err);
        }
        callback(null, result);
      });
    } catch(err) {
      console.error('Error:', err);
      throw err;
    }
}
,
  createNewForm: async (body, callback) => {
    try {
      const formfieldsString = JSON.stringify(body.formControls);
      const orgid = body.originalid || 0 ;
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
      throw e;
    }
  },
  
getSubmittedForms: async(id, callback)=>{
  try{
    const query = `SELECT formid FROM submittedform WHERE submittedby = ${id}`;
    dbUtils.executeQuery(query, callback)
  }catch(err)
  {
    throw err;
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
  } catch(e) {
    console.log(e);
    callback(e, null);
  }
},
// getFormDate: async(id, callback)=>{
//   try{
//     const query = `SELECT submittedat FROM submittedform WHERE submittedby = ${id}`;
//     dbUtils.executeQuery(query, callback)
//   }catch(err)
//   {
//     throw err;
//   }
// },
getOtherFormSubmission: async(id, userid, callback)=>{
  try{
    const query = `SELECT submittedat,submittedby,formid,id FROM submittedform WHERE formid = ${id} AND submittedby = ${userid}`;
    await dbUtils.executeQuery(query, callback)
  }catch(err)  
  {
     console.log(err);
  }
},
getFormControlResponse: async(id, formid,submissionId, callback) =>{
  try{
    if(submissionId)
    {
      const query = `SELECT formdata FROM submittedform WHERE submittedby = ${id} AND formid = ${formid} AND id = '${submissionId}'` ;
      dbUtils.executeQuery(query, callback)
    }
    else{
      const query = `SELECT formdata FROM submittedform WHERE submittedby = ${id} AND formid = ${formid}` ;
      dbUtils.executeQuery(query, callback)
    }
    
  }catch(err){
    console.log(err);
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
getForms: async (callback) => {
  const query = `SELECT * FROM forms WHERE status != 'deleted'`;
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

deleteFormByid : async (id, callback)=>{
  try {
    const query = `UPDATE forms SET status = 'deleted' WHERE id = ${id}`;
    await dbUtils.executeQuery(query, callback); 
  } catch (e) {
    console.log(e);
  }
}
} 
