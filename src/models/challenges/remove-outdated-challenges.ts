import OpenChallengeModel from "./openChallenge";

export const removeOutdatedChallengesFromDatabase = async () => {
    try {
        const currentTime = Date.now();
        await OpenChallengeModel.deleteMany({
            validityTime: { $lt: currentTime },
        });
    } catch (error) {
        console.log("Error in remove challenges");
    }
};
