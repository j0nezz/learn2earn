// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Distributor {

    struct AccountAmountStruct {
        address token;
        uint256 amount;
    }

    address private owner;
    address private spender;
    bytes32 private merkleRoot;

    // This is a mapping of each address to a mapping of how much they claimed of what token
    mapping(address => mapping(address => uint256)) private amountClaimedMap;

    constructor(address spender_, bytes32 merkleRoot_) {
        owner = msg.sender;
        spender = spender_;
        merkleRoot = merkleRoot_;
    }

    function changeSpender(address newSpender) public virtual {
        require(msg.sender == owner, "Distributor: not the owner");
        require(newSpender != address(0), "Distributor: change spender the zero address");
        spender = newSpender;
    }

    function updateMerkleRoot(bytes32 merkleRoot_) public {
        require(msg.sender == owner, 'Distributor: only owner can update merkle root');
        merkleRoot = merkleRoot_;
    }

    function transferOwnership(address newOwner) public virtual {
        require(msg.sender == owner, "Distributor: not the owner");
        require(newOwner != address(0), "Distributor: transfer owner the zero address");
        require(newOwner != address(this), "Distributor: transfer owner to this contract");
        owner = newOwner;
    }

    function amountClaimed(address account, address token) public view returns (uint256) {
        return amountClaimedMap[account][token];
    }

    function hashAccountAmounts(AccountAmountStruct[] memory accountAmounts) private view returns (bytes32) {
        uint256 arrayLength = accountAmounts.length;
        bytes[] memory encoded = new bytes[](arrayLength);
        for (uint i=0; i<arrayLength; i++) {
            encoded[i] = abi.encodePacked(accountAmounts[i].token,accountAmounts[i].amount);
        }
        return keccak256(abi.encode(encoded));
    }

    function claimableAmount(address account, AccountAmountStruct[] memory accountAmounts, bytes32[] calldata merkleProof) external view returns (AccountAmountStruct[] memory) {
        // Verify the merkle proof.
        bytes32 node = keccak256(abi.encodePacked(account, hashAccountAmounts(accountAmounts)));
        require(MerkleProof.verify(merkleProof, merkleRoot, node), 'Distributor: Invalid proof.');

        uint256 arrayLength = accountAmounts.length;
        for (uint i=0; i<arrayLength; i++) {
            accountAmounts[i].amount -= amountClaimed(account, accountAmounts[i].token);
        }
        return accountAmounts;
    }

    function claim(address account, AccountAmountStruct[] memory accountAmounts, bytes32[] calldata merkleProof) external {
        // Verify the merkle proof.
        bytes32 node = keccak256(abi.encodePacked(account, hashAccountAmounts(accountAmounts)));
        require(MerkleProof.verify(merkleProof, merkleRoot, node), 'Distributor: Invalid proof.');


        uint256 arrayLength = accountAmounts.length;
        uint256 totalClaimed = 0;
        for (uint i=0; i<arrayLength; i++) {
            address token = accountAmounts[i].token;
            uint256 amount = accountAmounts[i].amount;
            uint256 amountClaimed = amountClaimed(account, token);

            // amount to be transferred
            uint256 diff = amount - amountClaimed;

            if (diff > 0) {
                totalClaimed += diff;
                // Mark it claimed and send the token.
                amountClaimedMap[account][token] = amount;
                require(IERC20(token).transferFrom(spender, account, diff), 'Distributor: Transfer failed.');
            }
        }

        require(totalClaimed == 0, 'Distributor: no tokens to claim.');
    }
}