import { model, Schema } from "mongoose";
import { IOpenChallengeData } from "../../types/Challenge";

const OpenChallengeSchema = new Schema<IOpenChallengeData>({
    creator: { type: String, required: true },
    creatorColor: { type: Number, required: true },
    description: { type: String, required: true },
    validityTime: { type: Number, required: true },
});

const OpenChallengeModel = model<IOpenChallengeData>(
    "Open Challenge",
    OpenChallengeSchema
);

export default OpenChallengeModel;
