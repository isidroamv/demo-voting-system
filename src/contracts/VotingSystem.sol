// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract VotingSystem {
    struct Proposal {
        string name;
        string description;
        uint256 expirationDate;
        uint256 yesVotes;
        uint256 noVotes;
        bool proposalPassed;
        mapping(address => bool) hasVoted;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(address => uint256) public voterTokens;
    uint256 public proposalCount;

    event ProposalCreated(uint256 proposalId, string name, string description, uint256 expirationDate);
    event Voted(uint256 proposalId, bool inSupport);
    event ProposalFinalized(uint256 proposalId, bool proposalPassed);

    function join() public {
        require(voterTokens[msg.sender] == 0, "Already joined");
        voterTokens[msg.sender] = 1;
    }

    function propose(string memory name, string memory description, uint256 expirationDate) public returns (uint256) {
        require(voterTokens[msg.sender] > 0, "Not a voter");

        uint256 proposalId = proposalCount++;
        Proposal storage p = proposals[proposalId];
        p.name = name;
        p.description = description;
        p.expirationDate = expirationDate;

        emit ProposalCreated(proposalId, name, description, expirationDate);

        return proposalId;
    }

    function vote(uint256 proposalId, bool inSupport) public {
        require(proposalId < proposalCount, "Invalid proposal id");
        Proposal storage p = proposals[proposalId];

        require(voterTokens[msg.sender] > 0, "Not a voter");
        require(!p.hasVoted[msg.sender], "Already voted");
        require(block.timestamp < p.expirationDate, "Proposal has expired");

        p.hasVoted[msg.sender] = true;

        if (inSupport) {
            p.yesVotes++;
        } else {
            p.noVotes++;
        }

        emit Voted(proposalId, inSupport);
    }

    function isProposalApproved(uint256 proposalId) public view returns (bool) {
        require(proposalId < proposalCount, "Invalid proposal id");
        Proposal storage p = proposals[proposalId];

        uint256 totalVotes = p.yesVotes + p.noVotes;
        uint256 threshold = totalVotes * 70 / 100;

        return p.yesVotes > threshold;
    }

    function finalizeProposal(uint256 proposalId) public {
        require(proposalId < proposalCount, "Invalid proposal id");
        Proposal storage p = proposals[proposalId];
        require(!p.proposalPassed, "Proposal already passed");

        uint256 totalVotes = p.yesVotes + p.noVotes;
        uint256 threshold = totalVotes * 70 / 100;

        if (p.yesVotes > threshold) {
            p.proposalPassed = true;
        }

        emit ProposalFinalized(proposalId, p.proposalPassed);
    }

}
