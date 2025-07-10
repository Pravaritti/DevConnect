const validator = require("validator");

const validateSignUpdata = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid.");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password!");
  }
};

const validateEditProfile = (req) => {
  const allowedEditFields= ["firstName", "lastName", "emailId", "photoUrl", "gender", "age", "about", "skills"];
  //loop through all the req.body fields and check if every field is present inside allowed fields
  const isEditAllowed =Object.keys(req.body).every((field)=>allowedEditFields.includes(field));

  return isEditAllowed;
};
module.exports = {
  validateSignUpdata,
  validateEditProfile,
};
