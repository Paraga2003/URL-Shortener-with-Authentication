const User = require('../Models/users');
const {v4: uuidv4} = require('uuid');

const {getUser,setUser} = require('../Service/auth')
async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;

  await User.create({
    name,
    email,
    password,
  });

  return res.render("home");
}

async function handleUserlogin(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ // ✅ fixed variable name
    email,
    password,
  });

  if (!user) {
    return res.render("login", {
      error: "Invalid email or password",
    });
  }
  const sessionId = uuidv4();
  setUser(sessionId,user);
  res.cookie('uid',sessionId);
  return res.render("home");
}

module.exports = {
  handleUserSignup,
  handleUserlogin,
};
