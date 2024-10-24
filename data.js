require('dotenv').config();
const Books = require('./models/models.books');
const dbConnection= require('./utils/db');
const dataJson = require('./data.json');


const Start = async () =>{
  try {
     await dbConnection();
     await Books.deleteMany();
     await Books.create(dataJson);
  } catch (error) {
    console.log("error fromm data.js", error)
  }
}

Start()