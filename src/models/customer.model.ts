import userModel from './user.model';

const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({});
customerSchema.add(userModel.schema);

const customerModel = userModel.discriminator('Customer', customerSchema);

export default customerModel;
