import userModel from './user.model';

const mongoose = require('mongoose');

const managerSchema = mongoose.Schema({
  expiredDate: {
    type: Date,
    required: true
  },
  maxCourt: {
    type: Number,
    require: true
  },
  packagePurchases: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'PackagePurchase' }
  ],
  branchs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }],
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }]
});
managerSchema.add(userModel.schema);

const managerModel = userModel.discriminator('Manager', managerSchema);

export default managerModel;
