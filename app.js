const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Sequelize = require('sequelize');

const User = require('./model/user');
const sequelize = require('./util/database');
const { error } = require('console');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/users/signup', async (req, res, next) => {
  try {
    let name = req.body.name; // Lowercase 'name' variable
    let email = req.body.email;
    let password = req.body.password;
    console.log(email);

    // Send a response back to the client
    const createdUser = await User.create({ name:name, email:email, password:password }); // Use 'name', 'email', and 'password'
    res.status(201).json({ message: 'User created successfully', name }); // Use 'name' in the response JSON
  } catch (error) {
    // Handle errors here and send an appropriate error response
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
sequelize.sync().then((result)=>{
  console.log(result);
  app.listen(4000, () => {
    console.log('Server is running on port 4000');
  });

})
.catch((error)=>{
  console.log(error);
})


