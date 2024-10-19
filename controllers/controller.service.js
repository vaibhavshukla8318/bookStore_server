const Service = require("../models/models.service");

const services = async (req, res)=>{
  try {
    const response = await Service.find();
    if(!response){
      return res.status(400).json({msg: "No services found"});
      return;
    }

    res.status(200).json({msg: response});
  } catch (error) {
    console.log(`services: ${error}`);
  }
}

module.exports = services;