const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const express = require("express");
const {restrictToLoggedinUserOnly} = require('./middleware/auth')
const {connectToMongo} = require('./connect');


const URL = require('./Models/url');
const urlRoute = require('./Routes/url');
const staticRoute = require('./Routes/staticRouter');
const userRoute = require('./Routes/user');

const app = express();
const port = 8001;

connectToMongo("mongodb://127.0.0.1:27017/short-url").then(() => console.log('Connected to MongoDB'));

// we are using ejs for server side rendering
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.json()
);

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());


app.use("/user",userRoute);

app.use('/',staticRoute);

// app.get('/test',async (req,res)=>{
//   const allUrls = await URL.find();
//   // return res.end(`
//   //   <html>
//   //     <head></head>
//   //     <body>
//   //       <ol>
//   //         ${allUrls.map(url=>`<li>${url.shortId}-${url.redirectURL} - ${url.visitHistory.length}</li>`).join('')}
//   //       </ol>

//   //     </body>
//   //   </html>
//   //   `);
//   return res.render('home',{
//     urls:allUrls,
//   });
// })


app.get('/url/:shortId',async (req,res)=>{
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId }, 
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );
  res.redirect(entry.redirectURL);

})


app.use('/url',restrictToLoggedinUserOnly, urlRoute);
app.listen(port,()=>console.log(`Server started  at port: ${port}`));