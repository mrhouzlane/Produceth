// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Prod {

    address private artist; 
    address public owner;

    enum negociationState {started, agreement, signed}

    constructor(address _company) {
        owner = _company;
    }

    struct CC0  {
        string name;
        address DAO; 
    }

    struct Production {
        uint id;
        address contractType; //contract chosen by the artist to sign with Produceth : A || B 
        uint baseSalary; 
        uint bonus; 
        negociationState _state;
    }

    mapping (address =>  Production) addressToProduction;  
    mapping (uint => bool) voteByNotes ; //mapping between aggregation of notes of the community on a feature vector and to YES/NO (true/false)
    // If the moyenne(votes) > 5/10 -> True -> we start the mint. 

   



}