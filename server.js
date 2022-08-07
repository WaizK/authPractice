const express = require('express')
const app = express();
const mongoose = require('mongoose');
const cipher = require("./utils/cipher")
require("dotenv").config()
console.log(process.env.SHIFT)

mongoose.connect('mongodb://localhost:27017/userDB')
app.use(express.urlencoded({extended: true}))

//a user schema 
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
})

// and a user model 
const User = mongoose.model('User', userSchema)



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/home.html');
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/pages/login.html');
})

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/pages/register.html');
})

app.post('/register', (req, res) => {
    //we will get a username and password from the req body
    const username = req.body.username
    const password = req.body.password
  //save the user and encrypt the password using ceaser cipher
  const newUser = new User({username:username, password:cipher(password,Number(process.env.SHIFT))})
  newUser.save((err)=>{
      if(!err){
        res.sendFile(__dirname + '/pages/secretPage.html')
      }
      else res.send(err)
  })
})

app.post('/login', (req, res) => {
    // const username = req.body.username
    //const password = req.body.password
    //homework
    //check if the user exists in the database
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username:username}, (err, foundUser)=>{
        //check if the password is correct
        if(!err){
            if(foundUser){
                if(cipher(foundUser.password, -Number(process.env.SHIFT)) === password){
                    res.sendFile(__dirname + '/pages/secretPage.html')
                }else res.send('Password Incorrect')
            }else res.send("User not found")
        }else{
            res.send(err);
        }
    })


})

app.get('/logout' , (req, res)=>{
    res.redirect('/')
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('server started on port: ' + PORT);
})