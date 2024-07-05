import { CourtReportStatus } from '../utils/enums';

const mongoose = require('mongoose');

const courtReportSchema = mongoose.Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court' },
    note: {
      type: String
    },
    description: {
      type: String
    },
    images: [{ type: String }],
    status: {
      type: String,
      require: true,
      enum: Object.values(CourtReportStatus)
    }
  },
  {
    timestamps: true
  }
);

const courtReportModel = mongoose.model('CourtReport', courtReportSchema);
export default courtReportModel;
