const express = require('express')
const router = express.Router()
const auth = require('../../Model/auth')
const Profile = require('../../Model/Profile')
const User = require('../../Model/userModel')



// creating profile
router.get("/me", auth, async (request, response) => {
    try {
      const profile = await Profile.findOne( {user: request.user.id} ).populate('user', ['firstname', 'lastname'] )
      
      
      if(!profile) {
        return response.status(400).json({ message: 'There is no profile'});
  
      }
  
      response.json(profile)
    } catch (error) {
      console.error(error.message)
      response.status(401).send('Server Error')
    }
  });


  // Create or update User

  router.post('/', auth,
    check('status', 'Status is required').notEmpty(),
    check('skills', 'Skills is required').notEmpty(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      // destructure the request
      const {
        website,
        skills,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook,
        // spread the rest of the fields we don't need to check
        ...rest
      } = req.body;
  
      // build a profile
      const profileFields = {
        user: req.user.id,
        website:
          website && website !== ''
            ? normalize(website, { forceHttps: true })
            : '',
        skills: Array.isArray(skills)
          ? skills
          : skills.split(',').map((skill) => ' ' + skill.trim()),
        ...rest
      };
  
      // Build socialFields object
      const socialFields = { youtube, twitter, instagram, linkedin, facebook };
  
      // normalize social fields to ensure valid url
      for (const [key, value] of Object.entries(socialFields)) {
        if (value && value.length > 0)
          socialFields[key] = normalize(value, { forceHttps: true });
      }
      // add to profileFields
      profileFields.social = socialFields;
  
      try {
        // Using upsert option (creates new doc if no match is found):
        let profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        return res.json(profile);
      } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
      }
    }
  );


  router.get('/', async (req,res) => {
    try{
      const profiles = await Profile.find().populate('user', ['firstname', 'lastname']);
      res.json(profiles)
    } catch (error) {
      console.error(error.message)
      res.status(500).send('Server Error')
    }
  })
  
  

module.exports = router