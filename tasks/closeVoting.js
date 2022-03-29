
module.exports = function () {
    task("closeVoting", "Close voting by Id")
        .addParam("votingId", "Voting id", undefined, types.int, false)
        .setAction(async (taskArgs) => {
            const VotingContractFactory = await ethers.getContractFactory("VotingContract");
            const VotingContract = await VotingContractFactory.attach("0x6856C49309B40293b84990465c0ff89df5084732");

            try {
                await VotingContract.CloseVoting(taskArgs.votingId);
            }
            catch (error) {
                console.error("Произошла ошибка!");
                return;
            }

            console.log(`Голосование с id ${taskArgs.votingId} успешно завершено!`);
        })
};
