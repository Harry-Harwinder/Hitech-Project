const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmployeeModel = require("./models/Employee");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/employee", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error: ", err));

// Registration API
app.post("/register", (req, res) => {
  EmployeeModel.create(req.body)
    .then((employee) => res.json({ success: true, employee }))
    .catch((err) =>
      res.status(500).json({ success: false, message: err.message })
    );
});

// Login API
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Find employee by email and password
  EmployeeModel.findOne({ email: email, password: password })
    .then((employee) => {
      if (employee) {
        // Credentials match, send success response
        res.json({ success: true, message: "Login successful", employee });
      } else {
        // Credentials don't match, send error response
        res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
      }
    })
    .catch((err) =>
      res.status(500).json({ success: false, message: err.message })
    );
});

// Start the server
app.listen(3001, () => {
  console.log("Server is Running on port 3001");
});
