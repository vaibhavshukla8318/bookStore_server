const express = require("express");
const router = express.Router();
const contactForm = require("../controllers/controllers.contact")

router.route("/contact").post(contactForm)
module.exports = router;