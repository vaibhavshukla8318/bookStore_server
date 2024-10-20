const User = require('../models/model.user');
const Contact = require('../models/model.contact')


// get All users for admin 
const getAllUsers = async (req, res) =>{
  try {
     const user = await User.find({}, {password: 0});
     console.log(user);

     if(!user || user.length === 0){
      return res.status(404).json({message: "No user found"});
     }
     res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}


// get all contact for admin

const getAllContact = async (req, res) => {
  try {
    const contact = await Contact.find({});

    if(!contact || contact.length === 0){
      return res.status(404).json({message: "No contact found"});
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
}

module.exports = {getAllUsers, getAllContact};