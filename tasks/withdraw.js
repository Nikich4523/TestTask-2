
module.exports = function () {
    task("withdraw", "Withdraw commission")
        .addParam("sum", "Sum (wei) to withdraw", undefined, types.int, false)
        .setAction(async (taskArgs) => {
            const VotingContractFactory = await ethers.getContractFactory("VotingContract");
            const VotingContract = await VotingContractFactory.attach("0x6856C49309B40293b84990465c0ff89df5084732");

            try {
                await VotingContract.Withdraw(taskArgs.sum);
            }
            catch (error) {
                console.error("Произошла ошибка!");
                return;
            }

            console.log(`Комиссия в размере ${taskArgs.sum} wei была успешно выведена на ваш адрес!`);
        })
};
