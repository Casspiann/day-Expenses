const User = require('../model/user');
const Expense = require('../model/expenses');
const sequelize = require('../util/database');





exports.getUserLeaderboard = async(req,res,next)=>{
    try{
        const users = await User.findAll();
        const expenses = await Expense.findAll();
        const userAggegrateExpense = {};

        expenses.forEach(expense => {
            const expenseAmount = parseInt(expense.expenceAmmount, 10); // Convert the string to an integer
            if (!isNaN(expenseAmount)) {
              if (userAggegrateExpense[expense.userId]) {
                userAggegrateExpense[expense.userId] += expenseAmount;
              } else {
                userAggegrateExpense[expense.userId] = expenseAmount;
              }
            }
            
        });

        var userLeaderBoardDetails = [];

        users.forEach(user=>{
            userLeaderBoardDetails.push({ name: user.name, totalCost: userAggegrateExpense[user.id] || 0 });
        })
        userLeaderBoardDetails.sort((a, b) => b.totalCost - a.totalCost);
        console.log(userLeaderBoardDetails);
        res.status(200).json({userLeaderBoardDetails});
    }
    catch(err){
        console.log(err);
        res.status(500).json({errror:err});
    }
}