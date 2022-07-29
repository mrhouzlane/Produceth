// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;


contract Produceth {

    address private artist; 
    address public owner;

    enum negociationState {started, agreement, signed}

    struct Production {
        uint id;
        address contractType; //contract chosen by the artist to sign with Produceth : A || B 
        uint baseSalary; 
        uint bonus; 
        negociationState _state;
    }

    mapping (address =>  Production) addressToProduction;  

    constructor(address _producerCompany) {
        owner = _producerCompany;
    }



}