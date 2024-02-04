// db.js
const mongoose = require("mongoose");

// Connect to MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://krishnavamsireddyduggireddy:75vzkhe8lfYopROT@cluster0.k5idxfu.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = mongoose.connection;
