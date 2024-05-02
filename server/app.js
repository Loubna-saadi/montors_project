const express = require('express');
const cors = require('cors');
const mongoose= require('mongoose');


const app = express();

const apirouter=require('./routes/ApiRoutes');
// Middleware
app.use(cors());
app.use(express.json());
// app.use(cors({ origin:"http://localhost:3000/"}));
//connection to database 

mongoose
  .connect(
    "mongodb://localhost:27017/mentorship",
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Test route
app.use("/api", apirouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

