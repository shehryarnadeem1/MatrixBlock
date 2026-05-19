// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AIMarketplace
 * @dev Decentralized marketplace for listing and purchasing access to AI models on MatrixBlocks.
 */
contract AIMarketplace {
    
    struct AIModel {
        uint256 id;
        address payable creator;
        string name;
        string description;
        string ipfsHash; // IPFS metadata link
        uint256 price; // Price in Wei (ETH equivalent)
        bool active;
    }

    // State Variables
    uint256 public modelCount;
    mapping(uint256 => AIModel) public models;
    
    // Mapping modelId => userAddress => accessGranted
    mapping(uint256 => mapping(address => bool)) public hasAccess;

    // Events
    event ModelListed(
        uint256 indexed id,
        address indexed creator,
        string name,
        string ipfsHash,
        uint256 price
    );

    event ModelPurchased(
        uint256 indexed id,
        address indexed buyer,
        address indexed creator,
        uint256 price
    );

    event ModelDeactivated(uint256 indexed id);

    // Modifiers
    modifier onlyCreator(uint256 _modelId) {
        require(models[_modelId].creator == msg.sender, "AIMarketplace: Only the model creator can call this function");
        _;
    }

    modifier modelExists(uint256 _modelId) {
        require(_modelId > 0 && _modelId <= modelCount, "AIMarketplace: Model does not exist");
        _;
    }

    /**
     * @notice Lists a new AI model in the marketplace
     * @param _name The name of the AI model
     * @param _description A short summary description of the AI model
     * @param _ipfsHash The IPFS metadata URI containing the model schema/weights
     * @param _price The cost to purchase access in Wei (1 ETH = 1e18 Wei)
     */
    function listModel(
        string calldata _name,
        string calldata _description,
        string calldata _ipfsHash,
        uint256 _price
    ) external returns (uint256) {
        require(bytes(_name).length > 0, "AIMarketplace: Name cannot be empty");
        require(bytes(_ipfsHash).length > 0, "AIMarketplace: IPFS hash cannot be empty");

        modelCount++;
        
        models[modelCount] = AIModel({
            id: modelCount,
            creator: payable(msg.sender),
            name: _name,
            description: _description,
            ipfsHash: _ipfsHash,
            price: _price,
            active: true
        });

        // The creator automatically gets access to their own model
        hasAccess[modelCount][msg.sender] = true;

        emit ModelListed(modelCount, msg.sender, _name, _ipfsHash, _price);
        return modelCount;
    }

    /**
     * @notice Purchases access to a listed AI model
     * @param _modelId The unique ID of the AI model to purchase
     */
    function purchaseModel(uint256 _modelId) external payable modelExists(_modelId) {
        AIModel storage model = models[_modelId];
        
        require(model.active, "AIMarketplace: Model is no longer active");
        require(msg.value >= model.price, "AIMarketplace: Insufficient ETH sent");
        require(!hasAccess[_modelId][msg.sender], "AIMarketplace: You already have access to this model");

        // Grant access
        hasAccess[_modelId][msg.sender] = true;

        // Transfer funds directly to the creator
        (bool success, ) = model.creator.call{value: msg.value}("");
        require(success, "AIMarketplace: ETH transfer to creator failed");

        emit ModelPurchased(_modelId, msg.sender, model.creator, model.price);
    }

    /**
     * @notice Allows a creator to deactivate their listed model
     * @param _modelId The unique ID of the model to deactivate
     */
    function deactivateModel(uint256 _modelId) external modelExists(_modelId) onlyCreator(_modelId) {
        require(models[_modelId].active, "AIMarketplace: Model is already inactive");
        models[_modelId].active = false;
        emit ModelDeactivated(_modelId);
    }
}
