// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


contract FundMe {

    uint256 public amount;

    constructor(uint256 _amount) {
        amount = _amount;
    }

    function fund() public payable{
        //1. How do we send ETH to his contract 
        require(msg.value > 1e18, "Not enough"); // 1 * 10 ** 18 // 1 ETH
    }

    // function withdraw() {}


}