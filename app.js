const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Sequelize = require('sequelize');

const User = require('./model/user');
const Expense = require('./model/expenses');
const sequelize = require('./util/database');
const { error } = require('console');
const bcrypt = require('bcrypt');


const app = express();
app.use(express.json());
app.use(cors());

function isStringInvalid(string){
  if(string == undefined || string.length === 0){
    return true;
  }
  else
{
  return false;
}
}

app.post('/expenses/add-expens', async (req, res, next) => {
  try {
    // Corrected variable name
    const amount = req.body.expen;
    const description = req.body.desc;
    const category = req.body.cate;
    // Check if the amount is missing or invalid
    if (!amount || isNaN(parseFloat(amount))) {
      return res.status(401).json({ err: "Bad Parameter, Invalid or Missing Amount" });
    }

   

    // Create a new expense record in your database using Sequelize
    const expense = await Expense.create({
      amount, // Updated variable name
      description,
      category
    });

    // Respond with the created expense data or a success message
    res.status(201).json({ newExpense: expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

app.post('/users/login', async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // Retrieve the user from the database by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password stored in the database using bcrypt
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'An error occurred while comparing passwords' });
      }

      if (result) {
        res.status(200).json({ message: 'Successfully Logged In' });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
});

app.post('/users/signup', async (req, res, next) => {
  try {
    const name = req.body.name; // Lowercase 'name' variable
    const email = req.body.email;
    const password = req.body.password;

    // Check if any of the input fields are invalid
    if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(401).json({ err: "Bad Parameter, Something is missing" });
    }

    // Hash the password using bcrypt
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'An error occurred while hashing the password' });
      }

      // Create a user with the hashed password
      try {
        const createdUser = await User.create({ name, email, password: hash });
        res.status(201).json({ message: 'User created successfully' });
      } catch (userCreationError) {
        console.error(userCreationError);
        res.status(500).json({ message: 'An error occurred while creating the user' });
      }
    });

  } catch (error) {
    // Handle errors here and send an appropriate error response
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
sequelize.sync().then((result)=>{
 // console.log(result);
  app.listen(4000, () => {
    console.log('Server is running on port 4000');
  });

})
.catch((error)=>{
  console.log(error);
})


