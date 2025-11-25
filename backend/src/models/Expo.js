import mongoose from 'mongoose'

const expoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an expo title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    theme: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide an end date'],
    },
    location: {
      venue: {
        type: String,
        required: [true, 'Please provide a venue name'],
      },
      address: {
        type: String,
        required: [true, 'Please provide an address'],
      },
      city: {
        type: String,
        required: true,
      },
      state: String,
      country: {
        type: String,
        required: true,
      },
      zipCode: String,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
      default: 'draft',
    },
    floorPlanUrl: {
      type: String,
      default: ''
    },
    floorPlan: {
      image: String,
      booths: [
        {
          boothNumber: String,
          location: {
            x: Number,
            y: Number,
          },
          size: {
            width: Number,
            height: Number,
          },
          status: {
            type: String,
            enum: ['available', 'reserved', 'occupied'],
            default: 'available',
          },
          exhibitorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
        },
      ],
    },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    maxExhibitors: {
      type: Number,
      default: 100,
    },
    registrationDeadline: Date,
  },
  {
    timestamps: true,
  }
)

const Expo = mongoose.model('Expo', expoSchema)

export default Expo
