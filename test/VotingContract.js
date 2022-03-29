const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("VotingContract", async function () {

    // Deploy contract when the tests are run
    let VotingContractFactory, VotingContract, owner, addr1, addr2, addr3, contractWeb3, abi;
    beforeEach(async function () {
        VotingContractFactory = await ethers.getContractFactory("VotingContract");
        VotingContract = await VotingContractFactory.deploy();
        [owner, addr1, addr2, addr3] = await ethers.getSigners();
    });

    describe("Function - CreateVoting", async function () {
        it("Function should create empty voting with given addresses", async function () {

            // frst test
            await VotingContract.CreateVoting([addr1.address, addr2.address]);

            let voting = await VotingContract.GetVotingInfo(0);
            let actualCandidatesList = voting["candidates"];
            let exceptedCandidatesList = [addr1.address, addr2.address];
            expect(actualCandidatesList).to.have.all.members(exceptedCandidatesList);

            // scnd test
            await VotingContract.CreateVoting([addr1.address, addr3.address]);

            voting = await VotingContract.GetVotingInfo(1);
            actualCandidatesList = voting["candidates"];
            exceptedCandidatesList = [addr1.address, addr3.address];
            expect(actualCandidatesList).to.have.all.members(exceptedCandidatesList);

            // thrd test
            await VotingContract.CreateVoting([addr1.address, addr2.address, addr3.address]);

            voting = await VotingContract.GetVotingInfo(2);
            actualCandidatesList = voting["candidates"];
            exceptedCandidatesList = [addr1.address, addr2.address, addr3.address];
            expect(actualCandidatesList).to.have.all.members(exceptedCandidatesList);

            // frth test
            await VotingContract.CreateVoting([addr1.address, addr2.address, addr3.address]);

            voting = await VotingContract.GetVotingInfo(2);
            actualCandidatesList = voting["candidates"];
            exceptedCandidatesList = [addr1.address, addr2.address, addr3.address, owner.address];
            expect(actualCandidatesList).not.to.have.same.members(exceptedCandidatesList);

        });

        it("Function should revert error if it was not called by the contract owner", async function () {
            await expect(VotingContract.connect(addr3).CreateVoting([addr1.address, addr2.address])).to.be.revertedWith("You are not the owner of the contract");
        });
    });

    describe("Function - GetVotingInfo", async function () {
        it("Function should return info about voting by id", async function () {

            // fields: candidates, votes, voters, fund, isActive
            let actualCandidates, actualVotes, actualVoters, actualFund, actualIsActive;
            let expectedCandidates, expectedVotes, expectedVoters, expectedFund, expectedIsActive;

            // frst test
            await VotingContract.CreateVoting([addr1.address, addr2.address]);

            let actualVotingInfo = await VotingContract.GetVotingInfo(0);
            actualCandidates = actualVotingInfo["candidates"].join();
            actualVotes = actualVotingInfo["votes"].map(n => Number(n)).join();
            actualVoters = actualVotingInfo["voters"].join();
            actualFund = Number(actualVotingInfo["fund"]);
            actualIsActive = actualVotingInfo["isActive"];

            expectedCandidates = [addr1.address, addr2.address].join();
            expectedVotes = [0, 0].join();
            expectedVoters = [].join();
            expectedFund = 0;
            expectedIsActive = true;

            let actualArray = [actualCandidates, actualVotes, actualVoters, actualFund, actualIsActive];
            let expectedArray = [expectedCandidates, expectedVotes, expectedVoters, expectedFund, expectedIsActive];

            expect(expectedArray).to.have.same.members(actualArray);

            // scnd test
            await VotingContract.connect(addr3).Vote(0, 0, { value: ethers.utils.parseEther("0.01") });
            actualVotingInfo = await VotingContract.GetVotingInfo(0);
            actualVotes = actualVotingInfo["votes"].map(n => Number(n)).join();
            actualVoters = actualVotingInfo["voters"].join();
            actualFund = Number(actualVotingInfo["fund"]);

            expectedVotes = [1, 0].join();
            expectedVoters = [addr3.address].join();
            expectedFund = Number(ethers.utils.parseEther("0.01"));

            actualArray = [actualCandidates, actualVotes, actualVoters, actualFund, actualIsActive];
            expectedArray = [expectedCandidates, expectedVotes, expectedVoters, expectedFund, expectedIsActive];

            expect(expectedArray).to.have.same.members(actualArray);
        });

        it("Function should revert error if given votingId more or equal than votings count", async function () {
            await expect(VotingContract.GetVotingInfo(0)).to.be.revertedWith("Unknown voting");

            await VotingContract.CreateVoting([addr1.address, addr2.address]);

            await expect(VotingContract.GetVotingInfo(0)).to.be.not.revertedWith("Unknown voting");
        });
    });

    describe("Function - Vote", async function () {
        it("Function should add voter in Voting, add vote to given candidateId and fill fund for 0,01 ETH", async function () {

            // fields: candidates, votes, voters, fund, isActive
            let actualCandidates, actualVotes, actualVoters, actualFund, actualIsActive;
            let expectedCandidates, expectedVotes, expectedVoters, expectedFund, expectedIsActive;

            // frst test
            await VotingContract.CreateVoting([addr1.address, addr2.address]); // Add Voting
            await VotingContract.connect(addr3).Vote(0, 1, { value: ethers.utils.parseEther("0.01") }); // Vote from addr3

            let actualVotingInfo = await VotingContract.GetVotingInfo(0);
            actualCandidates = actualVotingInfo["candidates"].join();
            actualVotes = actualVotingInfo["votes"].map(n => Number(n)).join();
            actualVoters = actualVotingInfo["voters"].join();
            actualFund = Number(actualVotingInfo["fund"]);
            actualIsActive = actualVotingInfo["isActive"];

            expectedCandidates = [addr1.address, addr2.address].join();
            expectedVotes = [0, 1].join();
            expectedVoters = [addr3.address].join();
            expectedFund = Number(ethers.utils.parseEther("0.01"));
            expectedIsActive = true;

            actualArray = [actualCandidates, actualVotes, actualVoters, actualFund, actualIsActive];
            expectedArray = [expectedCandidates, expectedVotes, expectedVoters, expectedFund, expectedIsActive];

            expect(expectedArray).to.have.same.members(actualArray);

            // scnd test
            await VotingContract.Vote(0, 1, { value: ethers.utils.parseEther("0.01") }); // Vote from Owner

            actualVotingInfo = await VotingContract.GetVotingInfo(0);
            actualCandidates = actualVotingInfo["candidates"].join();
            actualVotes = actualVotingInfo["votes"].map(n => Number(n)).join();
            actualVoters = actualVotingInfo["voters"].join();
            actualFund = Number(actualVotingInfo["fund"]);
            actualIsActive = actualVotingInfo["isActive"];

            expectedCandidates = [addr1.address, addr2.address].join();
            expectedVotes = [0, 2].join();
            expectedVoters = [addr3.address, owner.address].join();
            expectedFund = Number(ethers.utils.parseEther("0.02"));
            expectedIsActive = true;

            actualArray = [actualCandidates, actualVotes, actualVoters, actualFund, actualIsActive];
            expectedArray = [expectedCandidates, expectedVotes, expectedVoters, expectedFund, expectedIsActive];

            expect(expectedArray).to.have.same.members(actualArray);
        });

        it("Function should revert error if given votingId more or equal than votings count", async function () {
            await expect(VotingContract.Vote(0, 0)).to.be.revertedWith("Unknown voting");
        });

        it("Function should revert error if given candidateId more or equal than candidates count", async function () {
            await VotingContract.CreateVoting([addr1.address, addr2.address]);

            await expect(VotingContract.Vote(0, 2, { value: ethers.utils.parseEther("0.01") })).to.be.revertedWith("Unknown candidate");
        });

        it("Function should revert error if msg.value not equal 0,01 ETH", async function () {
            await VotingContract.CreateVoting([addr1.address, addr2.address]);

            await expect(VotingContract.Vote(0, 1)).to.be.revertedWith("To vote, you need to deposit 0,01 ETH");
        });

        it("Function should revert error if this address already voted", async function () {
            await VotingContract.CreateVoting([addr1.address, addr2.address]);
            await VotingContract.Vote(0, 0, { value: ethers.utils.parseEther("0.01") });

            await expect(VotingContract.Vote(0, 1, { value: ethers.utils.parseEther("0.01") }))
                .to.be.revertedWith("You already voted");
        });
    });

    describe("Function - Withdraw", async function () {
        it("Function should withdraw given sum for owner and reduce the total commission", async function () {
            await VotingContract.Withdraw(0);
            // 3 days later...
            await expect(await VotingContract.commission()).to.be.equal(0);
        });

        it("Function should revert error if it was not called by the contract owner", async function () {
            await expect(VotingContract.connect(addr3).Withdraw(0)).to.be.revertedWith("You are not the owner of the contract");
        });

        it("Function should revert error if sum for withdraw more than commission", async function () {
            await expect(VotingContract.Withdraw(100)).to.be.revertedWith("Not enough money");
        });
    });

    describe("Function - CloseVoting", async function () {
        it("Function should revert error if given votingId more or equal than votings count", async function () {
            await expect(VotingContract.CloseVoting(0)).to.be.revertedWith("Unknown voting");

            await VotingContract.CreateVoting([addr1.address, addr2.address]); // Add Voting
            await expect(VotingContract.CloseVoting(0)).to.be.not.revertedWith("Unknown voting");
        });

        it("Function should revert error if exists more than one winner", async function () {

            // frst test
            await VotingContract.CreateVoting([addr1.address, addr2.address]); // Add Voting
            await VotingContract.Vote(0, 0, { value: ethers.utils.parseEther("0.01") }); // Add vote for frst candidate
            await VotingContract.connect(addr3).Vote(0, 1, { value: ethers.utils.parseEther("0.01") }); // Add vote for scnd candidate

            await expect(VotingContract.CloseVoting(0)).to.be.revertedWith("The winner has not yet been determined");

            // scnd test
            await VotingContract.CreateVoting([addr1.address, addr2.address]); // Add Voting
            await VotingContract.Vote(1, 0, { value: ethers.utils.parseEther("0.01") }); // Add vote for frst candidate
            await VotingContract.connect(addr3).Vote(1, 0, { value: ethers.utils.parseEther("0.01") }); // Add vote for frst candidate

            await expect(VotingContract.CloseVoting(1)).to.be.not.revertedWith("The winner has not yet been determined");
        });
    });
});