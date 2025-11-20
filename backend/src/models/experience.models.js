import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    portfolio: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio", required: true },
    company: { type: String, required: true },
    position: { type: String,required: true  },
    startDate: { type: Date,required: true  },
    endDate: { type: Date ,required: true },
    description: { type: String,required: true  },
  },
  { timestamps: true }
);

export const Experience = mongoose.model("Experience", experienceSchema);
