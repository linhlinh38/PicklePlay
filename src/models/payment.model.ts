const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
  accountNumber: {
    type: String,
    required: true
  },
  accountName: {
    type: String,
    required: true
  },
  accountBank: {
    type: String
  },
  expDate: {
    type: Date
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const paymentModel = mongoose.model('Payment', paymentSchema);
export default paymentModel;
