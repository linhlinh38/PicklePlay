const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
  accountNumber: {
    type: String
  },
  accountName: {
    type: String
  },
  accountBank: {
    type: String
  },
  expDate: {
    type: Date
  },
  apiKey: {
    type: String
  },
  clientId: {
    type: String
  },
  checksumKey: {
    type: String
  }
});

const cardModel = mongoose.model('Card', cardSchema);
export default cardModel;
