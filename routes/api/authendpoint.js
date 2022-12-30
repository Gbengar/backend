const express = require('express');
const router = express.Router()
const auth = require('../../Model/auth')

router.get("/", auth, (request, response) => {
    response.json({ message: "You now have access to server" });
  });


module.exports = router
  