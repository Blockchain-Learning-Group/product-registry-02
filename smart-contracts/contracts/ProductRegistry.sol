pragma solidity 0.4.24;


contract ProductRegistry {
    struct Product {
        string title;
        string description;
        string submitterAvatar;
        string productImage;
        uint256 votes;
    }

    Product[] public products;

    function addProduct(string title, string description, string submitterAvatar, string productImage) external {
        products.push(
            Product(title, description, submitterAvatar, productImage, 0)
        );
    }

    function voteForProduct(uint256 arrayIndex) external {
        products[arrayIndex].votes++;
    }

    function productCount() view returns(uint) {
        return products.length;
    }
}