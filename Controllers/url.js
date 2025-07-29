const shortid = require('shortid'); //package of npm for generating 
const URL = require('../Models/url');
async function handleGenerateShortURL(req,res){
  const body = req.body;

  if(!body.url) return res.status(400).json({"error":"URL is required"});
  const shortID = shortid();
  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory:[],
  });
  return res.render('home',{
    id:shortID,
  });
  


}
async function handleGetAnalytics(req,res){
  const shortId = req.params.shortId;
  const result = await URL.findOne({shortId});
  return res.json({totalClicks:result.visitHistory.length ,Analytics:result.visitHistory });


}

module.exports = {handleGenerateShortURL,handleGetAnalytics};