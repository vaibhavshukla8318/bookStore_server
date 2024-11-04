const User = require('../models/model.user')

// home controllers
const home = async(req, res) =>{
  try{
    res.status(200).send("Hi this part is coming from controllers");
  }
  catch(error){
    res.status(400).send(error);
  }
}



// register controllers
const register = async(req, res)=>{
  try {

    // console.log(req.body);
    const {username, email, phone, password} = req.body;
    const userExist = await User.findOne({email});

    if(userExist){
      return res.status(400).json({message: "email already exists"})
    }
     
    const createdUser = await User.create({username, email, phone, password})

    res.status(200).json({
      message: "registration successful",
      token: await createdUser.generateToken(),
      userId: createdUser._id.toString()
    })

  } catch (error) {
    res.status(400).json({message: error});
  }
}


// Login controller
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    // Compare password using the model method
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate token
    const token = await user.generateToken();

    res.status(200).json({
      message: "Login successful",
      token: token,
      userId: user._id.toString(),
      // isAdmin: user.isAdmin
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
    // next(error);
  }
};


// to send user data = User Controller
 const user = async (req, res) =>{
  try {
    const userData = req.user;
    // console.log(userData);
    res.status(200).json({userData });
  } catch (error) {
     console.log(`error from the user route ${error}`);
  }
 }



module.exports = {home, register, login, user};