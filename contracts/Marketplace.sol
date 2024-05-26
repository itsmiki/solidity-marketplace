// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.11;

contract Marketplace {

    enum State {Created, Sold, Withdrawn}

    struct Offer {
        uint256 price;
        string title;
        string description;
        string photo;
        address payable seller;
        address payable buyer;
        State state;
    }

    Offer[] public offers;

    constructor() {      
    }

    /// The function cannot be called at current state.    
    error InvalidState();

    /// You are not allowed to call this function.
    error Unauthorized();

    modifier inState(State state_, uint256 offerid_) {
        if(offers[offerid_].state != state_) {
            revert InvalidState();
        }
        _; // oznacza, że dalej zostanie wykonana funkcja
    }

    modifier authorize(address person_) {
        if(msg.sender != person_) {
            revert Unauthorized();
        }
        _;
    }

    function create(uint256 price_, string memory title_, string memory description_, string memory photo_) external {
        offers.push(Offer( price_*10e17, title_, description_, photo_, payable(msg.sender), payable(address(0x0)), State.Created));
    }

    function buy(uint256 offerid_) inState(State.Created, offerid_) external payable {
        require(msg.value == offers[offerid_].price, "Not enough money sent.");
        offers[offerid_].buyer = payable(msg.sender); // tutaj msg.sender to osoba, która wywoła funkcję, czyli kupujący
        offers[offerid_].state = State.Sold;
        offers[offerid_].seller.transfer(offers[offerid_].price);
    }

    function withdraw(uint offerid_) external authorize(offers[offerid_].seller) inState(State.Created, offerid_) {
        offers[offerid_].state = State.Withdrawn;
    }

    function getNumberOfOffers() public view returns(uint256) {
        return offers.length;
    }

    function getOffers() public view returns(Offer[] memory) {
        return offers;
    }
}