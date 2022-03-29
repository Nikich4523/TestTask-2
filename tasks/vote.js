
module.exports = function () {
    task("vote", "Vote for the one of the candidates")
        .addParam("votingId", "Voting id", undefined, types.int, false)
        .addParam("candidateId", "Candidate id", undefined, types.int, false)
        .setAction(async (taskArgs) => {
            const VotingContractFactory = await ethers.getContractFactory("VotingContract");
            const VotingContract = await VotingContractFactory.attach("0x6856C49309B40293b84990465c0ff89df5084732");

            try {
                await VotingContract.Vote(taskArgs.votingId, taskArgs.candidateId, { value: ethers.utils.parseEther("0.01") })
            }
            catch (error) {
                console.error("Произошла ошибка!");
                return;
            }

            console.log(`Вы проголосовали в ${taskArgs.votingId}-м голосовании за кандидата с номером ${taskArgs.candidateId}`);
        })
};
