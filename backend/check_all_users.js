const mongoose = require("mongoose");
const env = require("./src/config/env.config");
const User = require("./src/models/user.model");

async function check() {
  await mongoose.connect(env.MONGODB_URI);
  console.log("Connected to MongoDB.");
  const users = await User.find({}).select("+password +isActive +email +role");
  console.log("All users found:", users.map(u => ({ email: u.email, role: u.role, isActive: u.isActive })));
  mongoose.disconnect();
}

check().catch(console.error);
