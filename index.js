require("dotenv").config();
const cors = require('cors');
const express = require('express')
const app = express()
const path = require('path');
const authRouter = require("./router/router.auth")
const formRouter = require("./router/router.contact");
const serviceRouter = require("./router/router.service");
const adminRouter = require('./router/router.admin');
const bookRouter = require('./router/router.books');


const connectDB = require("./utils/db");
const errorMiddleware = require("./middlewares/middleware.error");


// cors

const corsOptions = {
  origin: 'https://bookstore8318.netlify.app',
  // origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD']
};

app.use(cors(corsOptions));

// middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", authRouter);
app.use("/api/form", formRouter);
app.use("/api/data", serviceRouter);
app.use("/api/bookstore", bookRouter)


// Router for admin
app.use("/api/admin", adminRouter);

// routes
app.get('/', (req, res) => {
  res.status(200).send("Hi this message is comming from backend part")
})

// error
app.use(errorMiddleware)


const PORT = 8080 || PORT;

// server
connectDB().then(()=>{
  app.listen(PORT, ()=>{
    console.log(`app is running on port: ${PORT}`);
  })
})
