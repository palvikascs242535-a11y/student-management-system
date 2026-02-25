const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,      // ❗ duplicate email prevent
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["boss", "admin", "user"],
    default: "user"
  },

  status: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ❗ remove password from response automatically
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", UserSchema);