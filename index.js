require("dotenv").config();
const express = require('express')
const app = express()
const router = require("./router/router.auth")
const connectDB = require("./utils/db");

// middleware
app.use(express.json());

app.use("/api/auth", router);

// routes
app.get('/', (req, res) => {
  res.status(200).send("Hi this message is comming from backend part")
})

// Port 
const PORT = 3000;

// server
connectDB().then(()=>{
  app.listen(PORT, ()=>{
    console.log(`app is running on port: ${PORT}`);
  })
})
