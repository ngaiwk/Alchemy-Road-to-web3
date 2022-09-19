// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract ChainBattles is ERC721URIStorage  {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Character {
        uint256 level;
        uint256 speed;
        uint256 strength;
        uint256 life;
    }

    mapping(uint256 => Character) public tokenIdToCharacter;

    constructor() ERC721 ("Chain Battles", "CBTLS") {
    }

    function generateCharacter (uint256 tokenId) public view returns (string memory) {

        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            '<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>',
            '<rect width="100%" height="100%" fill="black" />',
            '<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">',"Warrior",'</text>',
            '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">', "Levels: ",getLevels(tokenId),'</text>',
            '<text x="50%" y="60%" class="base" dominant-baseline="middle" text-anchor="middle">', "Spped: ",getSpeed(tokenId),'</text>',
            '<text x="50%" y="70%" class="base" dominant-baseline="middle" text-anchor="middle">', "Strength: ",getStrength(tokenId),'</text>',
            '<text x="50%" y="80%" class="base" dominant-baseline="middle" text-anchor="middle">', "Life: ",getLife(tokenId),'</text>',
            '</svg>'
        );
        return string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(svg)
            )    
        );
    }

    function getLevels(uint256 tokenId) public view returns (string memory) {
        Character memory charactor = tokenIdToCharacter[tokenId];
        return charactor.level.toString();
    }

    function getSpeed(uint256 tokenId) public view returns (string memory) {
        Character memory charactor = tokenIdToCharacter[tokenId];
        return charactor.speed.toString();
    }

    function getStrength(uint256 tokenId) public view returns (string memory) {
        Character memory charactor = tokenIdToCharacter[tokenId];
        return charactor.strength.toString();
    }

    function getLife(uint256 tokenId) public view returns (string memory) {
        Character memory charactor = tokenIdToCharacter[tokenId];
        return charactor.life.toString();
    }

    function getTokenURI (uint256 tokenId) public view returns (string memory) {
        bytes memory dataURI = abi.encodePacked(
            '{',
                '"name": "Chain Battles #', tokenId.toString(), '",',
                '"description": "Battles on chain",',
                '"image": "', generateCharacter(tokenId), '"',
            '}'
        );
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

    function mint() public {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);

        //level, speed, strength, life
        Character memory characterInit = Character(0, 10, 10, 10);
 
        tokenIdToCharacter[newItemId] = characterInit;
        _setTokenURI(newItemId, getTokenURI(newItemId));
    }

    function train(uint256 tokenId) public {
        require(_exists(tokenId), "Please use an existing token");
        require(ownerOf(tokenId) == msg.sender, "You must own this token to train it");
        Character memory char = tokenIdToCharacter[tokenId];
        uint256 currentLevel = char.level;
        uint256 currentSpeed = char.speed;
        uint256 currentStrength = char.strength;
        uint256 currentLife = char.life;
        char.level = currentLevel + 1;
        char.speed = currentSpeed + 5;
        char.strength = currentStrength + 5;
        char.life = currentLife + 5; 
        tokenIdToCharacter[tokenId] = char;
        _setTokenURI(tokenId, getTokenURI(tokenId));
    }

}