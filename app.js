const express = require("express");
const app = express();
const dbConnect = require('./db/dbConnect')
const Profile = require('./Model/Profile')
const auth = require('./Model/auth')
const router = express.Router();
const path = require('path');
const cors = require('cors')



dbConnect();

app.get('/', (req,res)=> res.send('API working'))

// Init Middleware
app.use(express.json());

// Define Route

// Curb Cores Error by adding a header here

app.use((req,res,next) =>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next()

  app.use('/register', require('./routes/api/register'));
app.use('/auth-endpoint', require('./routes/api/authendpoint'));
app.use('/free-endpoint', require('./routes/api/home'));
app.use('/login', require('./routes/api/login'));
app.use('/profile', require('./routes/api/profile'));

})



//Get current User Profile

router.get('/me', auth, async (req,res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['firstname', 'lastname'])
    if(!profile){
      return res.status(400).json({ message : 'No profile for User' })
    }

    res.json(profile)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

//Get Profiles

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


