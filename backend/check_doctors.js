const mongoose = require("mongoose");
const env = require("./src/config/env.config");
const User = require("./src/models/user.model");
const bcrypt = require("bcryptjs");

async function check() {
  await mongoose.connect(env.MONGODB_URI);
  console.log("Connected to MongoDB.");
  const doctors = await User.find({ role: "doctor" }).select("+password +isActive +email +role");
  for (const d of doctors) {
    console.log(`Email: ${d.email}, Password starts with '$2': ${d.password.startsWith('$2')}`);
    const isMatch = await bcrypt.compare("Doctor@123", d.password);
    console.log(`Password match with 'Doctor@123': ${isMatch}`);
  }
  mongoose.disconnect();
}

check().catch(console.error);
