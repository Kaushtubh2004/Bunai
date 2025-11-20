import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    portfolio: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio", required: true },
    institution: { type: String, required: true },
    degree: { type: String, required: true  },
    fieldOfStudy: { type: String, required: true  },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true  },
    grade: { type: String, required: true  },
  },
  { timestamps: true }
);

export const Education = mongoose.model("Education", educationSchema);
