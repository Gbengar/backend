const express = require('express')
const router = express.Router()

router.get("/", (request, response, next) => {
    response.json({ message: "Hey! This is your server response!" });
    next();
  });

  
module.exports = router