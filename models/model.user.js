/* 

   1. Model:
        A model is a constructor function that is created using a schema. The model represents the actual collection in the MongoDB database and provides an interface to interact with the documents (i.e., querying, inserting, updating, and deleting data). In other words, the model is used to create instances of documents (based on the schema) and to work with them in your application.



        2. Schema:
            A schema is a blueprint or structure for your data in the database. It defines the shape and content of documents within a MongoDB collection. Think of it as a framework that outlines what fields will be stored in your documents and what types of data each field will contain.

*/





const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
    type: String,
  },
  email:{
    type: String,
    unique: true
  },
  phone:{
    type: String,
  },
  password:{
    type: String,
  },
  isAdmin:{
    type: Boolean,
    default: false
  },
  isLogin: {
    type: Boolean,
    default: false
  }
})

// Securing or hashing Password
userSchema.pre("save", async function(next){
   const user = this;
   if(!user.isModified('password')){
     next();
   }
   try {
    const saltRound = 10
    const hashedPassword = await bcrypt.hash(user.password, saltRound);
    user.password = hashedPassword;
   } catch (error) {
    next(error);
   }
})

// generating token
userSchema.methods.generateToken = async function(){
   try {
    return jwt.sign(
      {
      userId: this._id.toString(),
      email: this.email,
      isAdmin: this.isAdmin
    },
     process.env.JWT_SECRET_KEY,
     { 
      expiresIn: '30d' 
    }
  )
   } catch (error) {
    console.error(error);
   }
}

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  try {
    const user = this;
    return await bcrypt.compare(enteredPassword, user.password);
  } catch (error) {
    throw error;
  }
};


const user = mongoose.model("User", userSchema);
module.exports = user;