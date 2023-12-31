const userServices = require('../services/userServices');

const getUser = async(req,res)=>{
    try{
        const id = await req.params.id;
        await userServices.getUserByid(id, (err, results)=>{
          if(err)
          {
            return res.status(500).json({message: "Database connection error"})
          }
          if(results.rows.length === 0)
          {
            return res.status(404).json({message: "User not found"})
          }
          const result = results.rows[0];
          delete result.password;
          return res.status(200).json({
            data: result
          })
        })
      }catch(e){
        console.log(e);
      }
};
const addNewUserFormSubmission = async (req, res) => {
  try {
    const formid = req.params.id;
    const body = { ...req.body, formid };
    // console.log(body);
    await userServices.createNewFormSubmission(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Database connection error.......",
        });
      }
      return res.status(200).json({
        message: "New Submission created.",
      });
    });
  } catch (e) {}
};
const updateUser = async (req, res) => {
    try {
      const id = req.params.id;
      
      // to check if a user exists or not and then update
      userServices.getUserByid(id, (err, results) => {
        if (results.rows.length === 0) {
          return res.status(404).json({ message: "User not found" });
        }
  
        const updatedUserData = req.body;
        userServices.updateUserByid(id, updatedUserData, (err, results) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }
          return res.status(200).json({ message: "User updated successfully" });
        });
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  const deleteUser = async ( req, res )=>{
    try {
        const id = await req.params.id;
        await userServices.getUserByid(id, (err, results) => {
          if (results.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
          }
          
          // If the user exists, proceed with deletion
          userServices.deleteUserByid(id, (err, results) => {
            if (err) {
              return res.status(500).json({ message: err.message });
            }
            return res.status(200).json({
              message: "User deleted successfully"
            });
          });
        });
      } catch (e) {
        console.log(e);
      }
  }
  const otherFormSubmission = async (req, res) => {
    try {
      const id = req.params.id;
      const userid = req.params.userid;
  
      await userServices.getOtherFormSubmission(id, userid, (err, results) => {
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

module.exports ={getUser,updateUser,deleteUser, addNewUserFormSubmission, otherFormSubmission}


