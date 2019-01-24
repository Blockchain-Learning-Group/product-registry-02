pragma solidity ^0.4.24;

contract ProductRegistry2 {
    struct Product {
        string name;
        string otherData;
        uint256 votes;
        uint256 totalProductsBought;
        uint256 totalRevenueToClaim;
        address owner;
    }

    mapping(string => Product) products;

    event ProductAdded(string name, string otherData);
    event NewProductEvent(string name, string eventDescription);
    event ProductBought(string name, uint256 value);

    function addProduct(string name, string otherData) external {
        products[name] = Product(name, otherData, 0, 0, 0, msg.sender);
        emit ProductAdded(name, otherData);
    }

    function voteForProduct(string name) external {
        products[name].votes++;
    }

    function logProductEvent(string name, string eventDescription) external {
        emit NewProductEvent(name, eventDescription);
    }

    function buyProduct(string name) external payable {
        // Load the product to be sold
        Product memory product = products[name];

        // Arbitrary rule that the number of votes determines the ether price, in wei!
        uint256 price = product.votes;
        require(msg.value >= price, "Insufficient ether sent to purchase the product");
    
        // New product has been bought
        product.totalProductsBought++;
        product.totalRevenueToClaim += price;

        // write product updates to storage
        products[name] = product;

        emit ProductBought(name, price);
    }

    function claimRevenue(string name) external {
        // Checks
        Product memory product = products[name];
        require(product.owner == msg.sender, "msg.sender is not the owner");

        // Effects
        uint256 revenueAmount = product.totalRevenueToClaim;
        products[name].totalRevenueToClaim = 0;

        // Interactions - withdraw the revenue to the owner
        product.owner.transfer(revenueAmount);
    }
}