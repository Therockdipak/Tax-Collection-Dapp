//SPDX-License-Identifier:MIT
pragma solidity 0.8.19;

contract TaxCollection {
    uint public taxAmount;
    address public taxCollector;

    mapping(address => uint) public taxPayerBalance;

    constructor(uint initialTaxAmount) {
        taxCollector = msg.sender;
        initialTaxAmount == taxAmount;
    }

    function payTax() public payable {
        require(msg.value >= taxAmount, "please enter valid amount");
        taxPayerBalance[msg.sender] += msg.value;
        payable(taxCollector).transfer(msg.value);
    }

    function getBalance(address taxPayer) public view returns (uint) {
        return taxPayerBalance[taxPayer];
    }
}
