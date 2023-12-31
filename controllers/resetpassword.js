const Sib  = require('sib-api-v3-sdk');
const dotenv = require('dotenv');
const uuid = require('uuid');


// get config vars
dotenv.config();
const bcrypt = require('bcrypt');
const User = require('../model/user');
const Forgotpassword = require('../model/forgotpassword');

const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;





exports.forgotpassword = async (req, res) => {
    try{
    const  Email  = req.body.email;
    const user = await User.findOne({where : { Email }});
    if(user){
        const id = uuid.v4();
        //console.log(id);
        //console.log(Email);
        //console.log(process.env.API_KEY);
        await user.createForgotpassword({ id , active: true })
                .catch(err => {
                    throw new Error(err)
                })
        

   
        const trnsEmailApi = new Sib.TransactionalEmailsApi();
        const sender ={
            email:"tarunrana1649@gmail.com",
            name:'Casspian'
        }
        const receiver = [{
            email:Email
        }]
        console.log(sender);
        console.log(receiver);
        
    const senderEmail = await trnsEmailApi.sendTransacEmail({
        sender,
        to: receiver,
        subject: 'Sending with SendinBlue is Fun',
        textContent: 'and easy to do anywhere, even with Node.js',
        htmlContent:`<h2>Reset Your Password </h2><a href="http://localhost:4000/password/resetpassword/${id}">Click it</a>`
        
    })
    console.log(senderEmail);
 
    

    res.status(202).json({ message:'Link to reset password sent to you r mail', success: true });
        }
    else
        {
            throw new Error('User doesnt exist')

        }
} catch(error){
    res.status(500).json({error});
}

    
};



exports.resetpassword = (req, res) => {
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}

exports.updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}

