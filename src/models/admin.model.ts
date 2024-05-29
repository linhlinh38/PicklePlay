import userModel from './user.model';

const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({});
adminSchema.add(userModel.schema);

const adminModel = userModel.discriminator('Admin', adminSchema);

export default adminModel;
