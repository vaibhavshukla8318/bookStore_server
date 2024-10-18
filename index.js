require("dotenv").config();
const cors = require('cors');
const express = require('express')
const app = express()
const authRouter = require("./router/router.auth")
const formRouter = require("./router/router.contact");
const connectDB = require("./utils/db");
const errorMiddleware = require("./middlewares/middleware.error");

// cors

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD']
};

app.use(cors(corsOptions));

// middleware
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/form", formRouter);

// routes
app.get('/', (req, res) => {
  res.status(200).send("Hi this message is comming from backend part")
})

// error
app.use(errorMiddleware)

// Port 
const PORT = 3000;

// server
connectDB().then(()=>{
  app.listen(PORT, ()=>{
    console.log(`app is running on port: ${PORT}`);
  })
})
