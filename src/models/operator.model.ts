import userModel from './user.model';

const mongoose = require('mongoose');

const operatorSchema = mongoose.Schema({});
operatorSchema.add(userModel.schema);

const operatorModel = userModel.discriminator('Operator', operatorSchema);

export default operatorModel;
