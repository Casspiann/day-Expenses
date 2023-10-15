const Expense = require('../model/expenses');

exports.addExpense = async (req, res, next) => {
  
  try {
    const Expens = req.body.expen;
    const Description = req.body.desc;
    const Category = req.body.cate;
    //console.log(Expens+" "+Description+" "+Category)
    //we can use magic function =  req.user.createExpense();
    const data = await Expense.create({
        expenceAmmount: Expens,
        description: Description,
        category: Category,
        userId: req.user.id
    });

    res.status(201).json({ newExpense: data, message:"Successfully add Expence" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
//
exports.getExpense = async (req, res, next) => {
    try {
       //we can use magic function =  req.user.getExpense();
      const expenses = await Expense.findAll({where:{userId: req.user.id}});
      res.status(200).json({ allExpense: expenses});
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };

exports.deleteExpense = async (req, res, next) => {
  try {
    const uid = req.params.id;

    if (!uid) {
      return res.status(400).json({ error: 'Id is Missing' });
    }
    //console.log("idddd>>>>>>>>>>>>",)
    const deleteExpences = await Expense.destroy({ where: { id: uid,userId : req.user.id } });
    //console.log(",,,,,,,,,,,,,"+deleteExpences);
    res.sendStatus(200).json({message:deleteExpences});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};
