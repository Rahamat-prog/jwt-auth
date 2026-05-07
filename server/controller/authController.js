const userModel = require('../model/userSchema');
const emailValidator = require("email-validator");
const bcrypt = require('bcrypt');

const signup = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  // console.log(name, email, password, confirmPassword);

  // validation check 
  if (!name || !email || !password || !confirmPassword) {
    return res.json({
      success: false,
      message: "every field is required"
    })
  }
  // email id validate 
  const validEmail = emailValidator.validate(email);
  if (!validEmail) {
    return res.status(400).json({
      success: false,
      message: "please enter valid email id"
    })
  }

  // password and confirmPassword if not match
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'password and confirmPassword is not match'
    })
  }

  try {
    const userInfo = userModel(req.body);

    // save inside database 
    const result = await userInfo.save();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    // if user is already registered so this error will be show.
    if (e.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Account is already registered",
      });
    }
    return res.status(400).json({
      success: false,
      message: e.message
    })

  }
}

// signin method 
const signin = async (req, res) => {
  const { email, password } = req.body;

  // check email and password is provided 
  if (!email || !password) {
   return res.status(400).json({
      success: false,
      message: "every field is require"
    })
  }

  try {

    // verify user is provide the corrct email id and password
    const user = await userModel.findOne({ email }).select('+password')
    // here compare the raw password with the encrepeted passward which aleady save inside the db. here we use bcrypt because we have provide the raw passwared but inside the database we save the passwas as a encrepted.
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        success: false,
        message: 'invalid email or password'
      })
    }

    // here store the token inside the cookie
    const token = user.jwtToken();
    user.password = undefined;

    const cookieOptin = {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true
    }

    res.cookie('token', token, cookieOptin);

    return res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }


}

// get the user details 
const getUser = async(req, res) => {
  // here user information kon dega and user login h ki nahi kon batauy ga so we create middleware
  const userId = await req.user._id;
  try {
    const user = await userModel.findById(userId);

    res.status(200).json({
      success: true,
      data: user
    })
  } catch(error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }

}


// logout the user 
const logout = (req, res) => {
try {
    const cookieOptin = {
    httpOnly: true,
    expires: new Date()
  }

  res.cookie("token", null, cookieOptin);

  res.status(200).json({
    success: true,
    message: 'user is logout successfully'
  })
} catch (error) {
  res.status(400).json({
    success: false,
    message: error.message
  })
}
}


module.exports = { signup, signin, getUser, logout };
