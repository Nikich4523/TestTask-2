
module.exports = function () {
    task("createVoting", "Create new voting with given addresses as candidates")
        .addParam(
            'addresses',
            'List of candidates addresses in format \'addr1 addr2 addr3 ...\'',
            undefined,
            types.string,
            false)
        .setAction(async (taskArgs) => {
            const VotingContractFactory = await ethers.getContractFactory("VotingContract");
            const VotingContract = await VotingContractFactory.attach("0x6856C49309B40293b84990465c0ff89df5084732");

            let addresses = taskArgs.addresses.split(" ");

            try {
                await VotingContract.CreateVoting(addresses);
            }
            catch (error) {
                console.error("Произошла ошибка!");
                return;
            }
            console.log(`Начато голосование со следующими кандидатами: ${addresses}`);
        })
};
