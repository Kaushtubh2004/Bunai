import mongoose from "mongoose";

const VisitSchema = new mongoose.Schema(
    {
        pageId: {
            type:String,
            required:true,
        },
    },
    { timestamps: true }
);

export const Visits = mongoose.model("Visits", VisitSchema);
