const Contact = require("../models/model.contact");

const contactForm = async(req, res) =>{
  try {
    const response = req.body;
    await Contact.create(response);
    return res.status(200).json({message: "message send successfully"})
  } catch (error) {
    res.status(500).json({ message: "message not delivered" });
  }
}

module.exports = contactForm;