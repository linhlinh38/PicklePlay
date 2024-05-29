const mongoose = require('mongoose');
const packageCourtSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  priceEachCourt: {
    type: Number,
    required: true
  },
  maxCourt: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  description: {
    type: String
  }
});

const packageCourtModel = mongoose.model('PackageCourt', packageCourtSchema);
export default packageCourtModel;
