
module.exports = function () {
    task("getVotingInfo", "Get all info about voting")
        .addParam("votingId", "Voting id", undefined, types.int, false)
        .setAction(async (taskArgs) => {
            const VotingContractFactory = await ethers.getContractFactory("VotingContract");
            const VotingContract = await VotingContractFactory.attach("0x6856C49309B40293b84990465c0ff89df5084732");

            let voting;
            try {
                voting = await VotingContract.GetVotingInfo(taskArgs.votingId);
            }
            catch (error) {
                console.error("Произошла ошибка!");
                return;
            }

            let candidates = voting["candidates"].join();
            let votes = voting["votes"].map(n => Number(n)).join();
            let voters = voting["voters"].join();
            let fund = Number(voting["fund"]);
            let isActive = voting["isActive"] ? "Активно" : "Завершено";

            console.table({ "Участники": candidates, "Голоса": votes, "Избиратели": voters, "Фонд": fund, "Статус голосования": isActive });
        })
};
