const express = require("express")
const { signup, signin, forgetPassword, resetPassword } = require("../controller/user")
const {check} = require('express-validator')
const multer = require("multer")
const user = require("../model/user")
const router = express.Router()
const upload = multer({dest: 'uploads/'})

router.post('/signup',upload.single('profile_pic') ,[
    check("first_name").isLength({min:3}),
    check("last_name").isLength({min:3}),
    check("email", "email should be valid").isEmail(),
    check(
        "pass",
        "Please enter a password at least 8 character and contain At least one uppercase.At least one lower case.At least one special character. ",
      )
  .isLength({ min: 8 })
  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
],signup)


router.post('/signin' ,signin)

router.post('/forget-password' ,forgetPassword)

router.post('/reset-password' ,resetPassword)

module.exports = router
 