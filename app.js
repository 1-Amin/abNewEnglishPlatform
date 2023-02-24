const express = require('express');
const app = express();
const port = process.env.PORT;
const ejs = require('ejs');
const bodyParser = require('body-parser');
const https = require("https");
const { url } = require('inspector');


app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');
app.use(express.static('public'))

app.get('/', function (req, res) {
    res.render('index');
})

app.get('/signup', function (req, res) {
    res.render('signup');
})

app.post('/', function (req, res) {
    const email = req.body.email;
    const firstName = req.body.fName;
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName
            }
        }]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us8.api.mailchimp.com/3.0/lists/c0290577f6";
    const option = {
        method: 'POST',
        auth: "amin1:98b8a6e1b8f829c3993597de6c5a4697-us8"
    }
    const request = https.request(url, option, function(response){
        response.on('data', function(data){
            // const resData = JSON.parse(data);
            // console.log(resData); 
            console.log(response.statusCode);   
            if(response.statusCode === 200){
                res.redirect('/success');
            }else{
                res.redirect('/fail');
            }
        })
    })
    request.write(jsonData);
    request.end();
})

app.get('/fail', function(req, res){
    res.render('fail')
});

app.get('/success', function(req, res){
    res.render('success')
});
app.get('/contacts', function(req, res){
    res.render('contacts');
});

app.listen(port || 3000, function(){
    console.log('Server Runs');
})