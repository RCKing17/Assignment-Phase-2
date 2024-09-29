const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // Will store hashed password
  role: { type: String, enum: ['SuperAdmin', 'GroupAdmin', 'User'], default: 'User' },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }]
});

// Hash the password before saving the user
userSchema.pre('save', async function(next) {
  try {
    // If the password field is not modified, skip hashing
    if (!this.isModified('password')) return next();

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    
    // Replace plain password with the hashed one
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Compare entered password with the hashed password stored in the database
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create the user model
const User = mongoose.model('User', userSchema);

module.exports = User;
