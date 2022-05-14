// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract QuizDistributor {

    struct MerkleStruct {
        bytes32 merkleRoot;
        uint256 timestamp;
    }

    struct Quiz {
        address token;
        uint256 reward;
        address owner;
        address spender;
    }

    address private owner;
    mapping(uint256 => Quiz) private quizzes;
    mapping(address => uint256[]) private claimedQuizzes;
    mapping(uint256 => MerkleStruct) private merkleRoots;

    event QuizCreated(address indexed owner, address spender, uint256 indexed quizId, address indexed token, uint256 reward);
    event RewardUpdated(uint256 indexed quizId, uint256 reward);
    event SpenderUpdated(uint256 indexed quizId, address spender);
    event MerkleUpdated(uint256 indexed quizId);
    event QuizClaimed(uint256 indexed quizId, address indexed user);

    constructor() {
        owner = msg.sender;
    }

    function transferOwnership(address _owner) public {
        require(owner == msg.sender, "Distributor: only the owner can transfer the ownership");
        owner = _owner;
    }

    function createQuiz(uint256 _quizId, address _token, address _spender, uint256 _reward) public {
        require(_reward > 0, "Distributor: reward must be a positive number");
        require(quizzes[_quizId].reward == 0, "Distributor: quiz with this id already exists");
        require(_spender != address(0), "Distributor: spender is the zero address");
        require(_spender != address(this), "Distributor: spender is this contract");
        require(_token != address(0), "Distributor: token is the zero address");
        require(_token != address(this), "Distributor: token is this contract");
        emit QuizCreated(msg.sender, _spender, _quizId, _token, _reward);
        quizzes[_quizId] = Quiz(_token, _reward, msg.sender, _spender);
    }

    function updateMerkleRoot(uint256 _quizId, bytes32 _merkleRoot, uint256 _timestamp) public {
        require(quizzes[_quizId].owner == msg.sender, "Distributor: only the owner of the quiz can update the merkle root");
        emit MerkleUpdated(_quizId);
        merkleRoots[_quizId] = MerkleStruct(_merkleRoot, _timestamp);
    }

    function updateQuizReward(uint256 _quizId, uint256 _reward) public {
        require(_reward > 0, "Distributor: reward must be a positive number");
        require(quizzes[_quizId].owner == msg.sender, "Distributor: only the owner of the quiz can update the reward");
        emit RewardUpdated(_quizId, _reward);
        quizzes[_quizId].reward = _reward;
    }

    function updateSpender(uint256 _quizId, address _spender) public {
        require(quizzes[_quizId].owner == msg.sender, "Distributor: only the owner of the quiz can update the spender");
        require(_spender != address(0), "Distributor: spender is the zero address");
        require(_spender != address(this), "Distributor: spender is this contract");
        emit SpenderUpdated(_quizId, _spender);
        quizzes[_quizId].spender = _spender;
    }

    function hasAlreadyClaimed(address _claimer, uint256 _quizId ) private view returns (bool) {
        for (uint i=0; i<claimedQuizzes[_claimer].length; i++) {
            if (claimedQuizzes[_claimer][i] == _quizId) {
                return true;
            }
        }
        return false;
    }

    function claim(uint256 _quizId, bytes32[] calldata _merkleProof) public {
        require(hasAlreadyClaimed(msg.sender, _quizId) == false, "Distributor: has already claimed this quiz");

        // Verify the merkle proof.
        require(MerkleProof.verify(_merkleProof, merkleRoots[_quizId].merkleRoot, keccak256(abi.encodePacked(msg.sender))), "Distributor: invalid proof");

        // Mark it claimed and send the token.
        claimedQuizzes[msg.sender].push(_quizId);
        emit QuizClaimed(_quizId, msg.sender);
        require(IERC20(quizzes[_quizId].token).transferFrom(quizzes[_quizId].spender, msg.sender, quizzes[_quizId].reward), "Distributor: transfer failed");
    }

    function getQuiz(uint256 _quizId) public view returns (Quiz memory) {
        return quizzes[_quizId];
    }

    function getClaimedQuizzes(address _claimer) public view returns (uint256[] memory) {
        return claimedQuizzes[_claimer];
    }

    function getMerkleRootTimestamp(uint256 _quizId) public view returns (uint256) {
        return merkleRoots[_quizId].timestamp;
    }
}
