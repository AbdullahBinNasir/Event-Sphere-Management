import mongoose from 'mongoose'

const exhibitorApplicationSchema = new mongoose.Schema(
  {
    expoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expo',
      required: true,
    },
    exhibitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    companyDescription: {
      type: String,
    },
    products: [String],
    services: [String],
    website: String,
    documents: [
      {
        name: String,
        url: String,
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    boothNumber: String,
    boothId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    rejectionReason: String,
    approvedAt: Date,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

// Index to prevent duplicate applications
exhibitorApplicationSchema.index({ expoId: 1, exhibitorId: 1 }, { unique: true })

const ExhibitorApplication = mongoose.model('ExhibitorApplication', exhibitorApplicationSchema)

export default ExhibitorApplication

