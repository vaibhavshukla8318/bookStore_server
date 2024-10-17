 /*
Controllers

    Definition: Controllers contain the logic that responds to incoming requests. They take input from the router, process it (often by interacting with models), and send back the appropriate response.

    Functionality:
    They serve as intermediaries between models and views (or client requests).
    Controllers handle the business logic and coordinate actions.

*/


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

    console.log(req.body);
    const {name, email, password} = req.body;
    const userExist = await User.findOne({email});

    if(userExist){
      return res.status(400).json({msg: "email already exists"})
    }
     
    const createdUser = await User.create({name, email, password})

    res.status(200).json({
      message: "registration successful",
      token: await createdUser.generateToken(),
      userId: createdUser._id.toString()
    })

  } catch (error) {
    res.status(400).json({message: error});
  }
}


module.exports = {home, register};