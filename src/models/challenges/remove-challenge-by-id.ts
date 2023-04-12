import OpenChallengeModel from "./openChallenge";

export const removeOpenChallengeById = async (id: string) => {
    try {
        await OpenChallengeModel.deleteOne({ _id: id });
    } catch (error) {
        console.log("could not remove challenge");
    }
};
