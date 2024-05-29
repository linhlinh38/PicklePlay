import userModel from './user.model';

const mongoose = require('mongoose');

const staffSchema = mongoose.Schema({
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager' },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CourtReport' }]
});
staffSchema.add(userModel.schema);

const staffModel = userModel.discriminator('Staff', staffSchema);

export default staffModel;
