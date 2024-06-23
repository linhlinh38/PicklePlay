const mongoose = require('mongoose');
const packagePurchaseSchema = mongoose.Schema(
  {
    totalPrice: {
      type: Number,
      required: true
    },
    totalCourt: {
      type: Number,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    priceEachCourt: {
      type: Number
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager' },
    packageCourt: { type: mongoose.Schema.Types.ObjectId, ref: 'PackageCourt' }
  },
  {
    timestamps: true
  }
);

const packagePurchaseModel = mongoose.model(
  'PackagePurchase',
  packagePurchaseSchema
);
export default packagePurchaseModel;
