const express = require('express');
const app = express();
const Router = express.Router();
const mysql = require('mysql');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'users'
});

db.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + db.threadId);
});

const isLoggedIn = (req, res, next) => {
    if (req.session.isLoggedIn === true) {
        next();
    } else {
        res.redirect('/login');
    }
}

Router.get('/',isLoggedIn,(req,res)=>{
    res.render('index');
})


Router.get('/signup', (req, res) => {
    res.render('signup');
});

Router.get('/login', (req, res) => {
    res.render('login');
});


Router.post('/signup', async(req, res) => {
    const { name, email, password } = req.body;

    db.query('SELECT email FROM userdata WHERE email = ?',[email], (err, result) => {
     if (err) throw err;
     if (result.length > 0) {
        req.flash('error', 'Something went wrong');
         res.redirect('/login');
     } 
    });

    db.query('INSERT INTO userdata SET ?', { name, email, password }, (err) => {
        if (err) throw err;
        req.flash('success', 'You are registered and can now login');
        res.redirect('/login');
    });
});


Router.post("/login", (req, res)=> {
    const {email, password} = req.body;
    db.query('SELECT * FROM userdata WHERE email = ?',[email], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
          if(result[0].password === password){
            req.session.isLoggedIn = true;
            req.session.user = result[0];
            res.redirect('/');
          } else {
            req.flash('error', 'Password is incorrect');
            res.redirect('/login');
          }
           
        } else {
            req.flash('error', 'Something went wrong');
            res.redirect('/login');
        }
    });
});



module.exports = Router;
