import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    portfolio: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio", required: true },
    title: { type: String, required: true },
    description: { type: String , required: true },
    techStack: { type: String, required: true  },
    projectLink: { type: String },
    githubLink: { type: String },
    image: { type: String ,required: true },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
