const User = require("../model/user")
const user = require("../model/user")
const jwt = require('jsonwebtoken')
const expressJwt = require("express-jwt")
const { validationResult } = require('express-validator')
const Mailgun = require("mailgun-js")
// const mg = Mailgun({apiKey: process.env.MAILGUN_APIKEY, domain:DOMAIN});s

exports.signup = (req,res) => {
   
    const errors = validationResult(req)
    
    if(!errors.isEmpty()){
        return res.status(400).json({
            error:errors.array()[0].msg
        })
    }

    const user = new User({
        first_name :req.body.first_name,
        last_name :req.body.last_name,
        username :req.body.username,
        pass :req.body.pass,
        confirm_pass:req.body.confirm_pass,
        email :req.body.email,
        phone_number :req.body.phone_number,
        profile_pic :req.file.path,
        country :req.body.country,
    })
    if(user.pass === user.confirm_pass){
    user.save({
        first_name :req.body.first_name,
        last_name :req.body.last_name,
        username :req.body.username,
        pass :req.body.pass,
        email :req.body.email,
        phone_number :req.body.phone_number,
        profile_pic :req.file.path,
        country :req.body.country,
    },(err,user) => {
        console.log(user,err);
        if(err){
            console.log(user,err);
            return res.status(400).json({
                error:"unable to add user"
            })
        }
        console.log(user,err);
        return res.json({
            message:"success create the account",
            user
        })

    })

}else{
    res.status(400).json({
        error:"password and confirm password should be same"
    })
}
}
exports.signin = (req, res) => {
    const {username, pass} = req.body

    User.findOne({username}, (err,user) => {
        if(err || !user){
            return res.status(400).json({
                error:"user not exixt"
            })
        }
        // Athentication of user
        if(!user.authenticate(pass)){
            return res.status(400).json({
                error:"username and password not match"
            })
        }
        // create a token
        const token = jwt.sign({_id: user._id}, process.env.SECRET)

        // put token to cookies
        res.cookie('token', token, {expier: new Date() + 1})


        // send resposnse 
        const {_id,username,first_name,last_name} = user
        return res.json({
            token,
            user: {
                _id,
                username,
                first_name,
                last_name
            }
        })

    })
}

exports.forgetPassword = (req, res) =>{
    const {username} = req.body;

    User.findOne({username}, (err, user) =>{
        if(err || !user){
            return res.status(400).json({
                error:"user doest exist"
            })
        }
        const token = jwt.sign({_id:user._id}, process.env.SECRET)
        const data = {
            from: 'noreply@test.com',
            to:user.email,
            subject:'password reset link',
            html:`
            <h2>please click on given linck to reset your password <h2>
            <p>${process.env.CLIENT_URL}/authantication/activa/${token}<p>
            `
        };

        return user.updateOne({resetLink: token}, function(err, success){
            if(err){
                return res.status(400).json({
                    error:"user with this emaildoest exist"
                });
            }else {
                // mg.message().send(data, function (error, body){
                    console.log(user)
                    // if(error){
                    //     return res.json({
                    //         error: err.message
                    //     })
                    // }
                    return res.json({message:' email hasbeen send'});
                
            
                    
//   })
   
}
})
})
}

exports.resetPassword = (req, res) =>{
    const {resetLink, newpass} = req.body;
    if(resetLink){
        jwt.verify(resetLink, process.env.SECRET, function(error, decodeddata){
            if(error){
                return res.status(401).json({
                    error:"incorrect token or expire"
                })
            }
            User.findOne({resetLink} ,(err, user) =>{
                if(err || !user){
                
                    return res.status(400).json({error:"user with this token not exixt"})
                }
                const obj = {
                    pass : newpass,
                    resetLink : ''
                }
                user = _.extend(user,obj)
                user.save((err, result)=>{
                    if(err){
                        return res.status(400).jason({error:" reset password error"})
                    }else{
                        return res.status(200).json({message:"passwork updated"})
                    }
                })
            })
        })
        }else{
            return res.status(401).json({
                error:"authanttication error"
            })
        }
    }





