const express = require("express");
const mongoose = require("mongoose");
const router=require("../backend/routes/destroute")


const travelpackagerouter=require("../backend/routes/travelpackageroutes")
const accommadationrouter=require("../backend/routes/accommadationroutes")
const userRoutes = require("../backend/routes/userRoutes");
const authRoutes = require("../backend/routes/authRoutes");
const bookingRoutes = require("../backend/routes/bookingroutes");

const reviewRouter = require("../backend/routes/ReviewRoute");
const blogRouter = require("../backend/routes/BlogRoute");

const eventRoutes = require("../backend/routes/event.route");

//import eventRoutes from './routes/event.route.js';

//const eventRoutes = require("../backend/routes/event.route.js");



const app = express();
const cors=require("cors");

// middleware 
app.use(express.json());
app.use(cors());

// strip accidental newlines (and other control chars) from the URL
app.use((req, res, next) => {
  if (req.url.includes('%0A') || req.url.includes('%0D')) {
    req.url = req.url.replace(/%0A|%0D/g, '');
  }
  // also trim decoded whitespace
  try { req.url = decodeURIComponent(req.url).replace(/\s+$/g, ''); } catch (_) {}
  next();
});


app.use("/travelpackage",travelpackagerouter );
app.use("/accommodation",accommadationrouter );
app.use("/api/auth", authRoutes); // Register routes under '/api/auth'

app.use("/bookings", bookingRoutes);
app.use("/user", userRoutes);

app.use("/reviews",reviewRouter);
app.use("/blogs",blogRouter);

app.use("/api/events", eventRoutes);


//app.use("/api/events", eventRoutes);



app.use("/destinations",router );

//mongodb+srv://admin:i0b18b4zhEYze0lB@cluster0.1buwn.mongodb.net/


mongoose.connect("mongodb+srv://admin:Cj1fYopndjY6fCmz@cluster0.z3zgd.mongodb.net/Travel?retryWrites=true&w=majority&appName=cluster0")
  .then(() => console.log("Connected to the database"))
  .then(() => {
    app.listen(5001, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.log(err));
