const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../../Model/userModel')
const jwt = require('jsonwebtoken')



router.post('/', (request, response)=>{
    User.findOne({email: request.body.email})
    .then((user)=>{
      bcrypt.compare(request.body.password, user.password)
      .then((passwordCheck)=>{
        // check if password matches
        if(!passwordCheck) {
          return response.status(400).send({
            message : 'Passwords does not match',
            error,
          })
        }
        //   create JWT token
        const token = jwt.sign({
          userId: user._id,
          userEmail: user.email,
        },
        'RANDOM-TOKEN',
        { expiresIn : '24h'}
         
        );
        response.status(200).send({
          message: 'Login Successful',
          email: user.email,
          token
        })
      })
      .catch((error)=>{
        response.status(400).send({
          message: 'Password does not match',
          error,
        })
      })
    })
    .catch((e)=>{
      response.status(404).send({
        message: 'Email not Found',
        e,
      })
    })
  })
  



  module.exports = router