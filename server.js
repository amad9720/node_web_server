const express = require('express');
const fs = require('fs');
const hbs = require('hbs');


var app = express();

app.use((req, res, next) => { //creating a middleware that helps use keep tracks on how our server is working
  var now = new Date().toString();
  var log = `${now} : ${req.method} ${req.url} `;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) console.log('Unable to append to server.log');
  });

  next();
});

// app.use((req, res, next) => { this chunk of code make the website in maintenance.
//   res.render('maintenance.hbs');

    //the site will block in the maintenance.hbs page because there is no next() after...
// });

hbs.registerPartials(__dirname + '/views/partials'); //set the partials directory : a partial is a reussable file inside some html code or other files...
hbs.registerHelper('currentYear', () => { //this function help us set global variables for them to be accessible inside our .hbs files. this will prevent us to always pass the variable in the render function
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

//third solution
app.set('view engine', 'hbs'); //the app.set method allows us to set some config for Express. this here is telling express to use hbs as it's view engine


app.get('/about',(req,res) => {
  res.render('about.hbs', {
    pageTitle : 'About Page'
    //currentYear: new Date().getFullYear()   --> Not necessary anymore because we set it as a global var via the registerHelper
  });
});

app.get('/',(req, res) => {
  // res.send('<h1>Hello Express</h1>'); //this method send the body data of the request
  res.render('home.hbs',{
    pageTitle : 'Home',
    //currentYear: new Date().getFullYear(),
    name : 'Amadou Ly',
    welcomeMessage : 'Welcome to this page',
    likes: ['biking','coding','reading', 'anime']
  });
}); //setting an handler for an http get request (mean that if someone send an http request in the link he will have some data back, be it an html page or JSON data)


//=============

//second solution =========
//use of middleware (to configure the behavior of express) : this will allow us to access any file inside the public folder without providing to the get request it specific root for each of them.
app.use(express.static(__dirname + '/public')); //__dirnmae is a var that contain the directory name which contain the file where it's called. here it's the name of the folder that contain server.js ... mean node_web_server

// =========== it will access all the files inside /public

//first solution =========
// app.get('/',(req, res) => {
//   // res.send('<h1>Hello Express</h1>'); //this method send the body data of the request
//   res.send({
//     name : 'Amadou Ly',
//     likes: ['biking','coding','reading', 'anime']
//   });
// }); //setting an handler for an http get request (mean that if someone send an http request in the link he will have some data back, be it an html page or JSON data)
//
//
// app.get('/bad',(req,res) => {
//   res.send({
//     error : 'Error 404 : Unable to send request'
//   });
// });

//===========

//to make the app start listening we have to call the listen function and doing so will bind our app to a port in our machine
app.listen(3000, () => {
   console.log('server is up on port 3000');
 }); //this function takes two parameters the fist is the port where to listen and the second is a callback function that specifie what to do when the server is up

//tampleting engine : handlebar (it's a view engine for express)
