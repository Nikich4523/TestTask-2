// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract VotingContract 
{
    address owner;
    uint public commission;

    struct Voting
    {
        address[] candidates;
        uint[] votes;
        address[] voters;
        uint startTimestamp;
        uint fund;
        bool isActive;
    }
    Voting[] votings;

    constructor()
    {
        owner = msg.sender;
    }

    modifier IsOwner()
    {
        require(msg.sender == owner, "You are not the owner of the contract");
        _;
    }

    function CreateVoting(address[] memory _candidates) 
    external IsOwner
    {
        uint startTimestamp = block.timestamp;
        Voting storage voting = votings.push();
        voting.candidates = _candidates;
        voting.isActive = true;
        voting.startTimestamp = startTimestamp;

        for (uint i = 0; i < _candidates.length; i++)
        {
            voting.votes.push(0);
        }
    }

    function GetVotingInfo(uint _votingId)
    external view
    returns (Voting memory)
    {
        require(_votingId < votings.length, "Unknown voting");
        return votings[_votingId];
    }

    function Vote(uint _votingId, uint _candidateId)
    external payable
    {
        require(_votingId < votings.length, "Unknown voting");
        require(msg.value == 10000000000000000, "To vote, you need to deposit 0,01 ETH");

        Voting storage voting = votings[_votingId];
        require(_candidateId < voting.candidates.length, "Unknown candidate");

        bool isAlreadyVote = false;
        for (uint i = 0; i < voting.voters.length; i++)
        {
            if (msg.sender == voting.voters[i])
            {
                isAlreadyVote = true;
            }
        }
        require(!isAlreadyVote, "You already voted");

        voting.voters.push(msg.sender);
        voting.votes[_candidateId]++;
        voting.fund += msg.value;

        require(voting.isActive, "Voting already closed");
    }

    function CloseVoting(uint _votingId)
    external payable
    {
        require(_votingId < votings.length, "Unknown voting");
        Voting storage voting = votings[_votingId];

        uint winnerId = 0;
        uint maxVotes = voting.votes[0];
        for (uint i = 0; i < voting.candidates.length; i++)
        {
            if (voting.votes[i] > maxVotes)
            {
                winnerId = i;
                maxVotes = voting.votes[i];
            }
        }

        bool isOnlyOneWinner = true;
        if (winnerId != voting.candidates.length - 1)
        {
            for (uint i = winnerId + 1; i < voting.candidates.length; i++)
            {
                if (voting.votes[i] == maxVotes)
                {
                   isOnlyOneWinner = false;    
                }
            }
        }
        
        require(isOnlyOneWinner, "The winner has not yet been determined");
        voting.isActive = false;

        uint sumToWinner = voting.fund * 90 / 100;
        uint sumToOwner = voting.fund - sumToWinner;
        payable(voting.candidates[winnerId]).transfer(sumToWinner);
        commission += sumToOwner;

        require(block.timestamp - voting.startTimestamp > 259200, "It hasn't been 3 days yet");
        require(voting.isActive, "Voting already closed");
    }

    function Withdraw(uint _sum)
    external payable IsOwner
    {
        require(_sum <= commission, "Not enough money");
        payable(msg.sender).transfer(_sum);
        commission -= _sum;
    }
}
