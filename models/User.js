const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

UserSchema.pre("save", function(next) {
  if (this.isNew || this.isModified("password")) {
    const document = this;
    document.password = this.password;
    next();
  } else {
    next();
  }
});

UserSchema.methods.isCorrectPassword = function(password, callback) {
  callback(password === this.password);
};

module.exports = mongoose.model("User", UserSchema);
