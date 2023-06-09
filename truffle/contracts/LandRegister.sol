// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract LandRegister is ERC721URIStorage {
    IERC20 public token1;
    address public superAdmin;

    constructor(address token) ERC721("TerraLandNFT", "TLNFT") {
        token1 = IERC20(token);
        superAdmin = msg.sender;
    }

    uint256 public reqCounter = 0;
    mapping(address => bool) public AdminWhitelist;

    struct buyer {
        uint256[] request;
        uint256[] lands;
        address wallet;
        string metadata;
    }
    struct requestLands {
        uint256 reqId;
       uint256 LandId;
        uint256 bid;
        address wallet;
        bool state;
    }
    enum Status {
        sold,
        onSale,
        awaitingPayment,
        reserved
    }

    uint256 public Counter = 0;
    struct Land {
        uint256 id;
        string long;
        string lat;
        string name;
        string imageURI;
        address CurrentOwner;
        string metadata;
        uint256 currPrice;
        Status status;
        address[] Owners;
    }
    mapping(uint256 => Land) public allLands;
    mapping(address => buyer) public allBuyers;
    mapping(uint256 => requestLands) public allrequests;

    function Signup(address wallet, string memory kycData) public {
        buyer memory newBuyer;
        newBuyer.wallet = wallet;
        newBuyer.metadata = kycData;
        allBuyers[wallet] = newBuyer;
    }

    function whiteList(address add) public {
        require(msg.sender == superAdmin, "You are not authorised");
        AdminWhitelist[add] = true;
    }

    function request(
     
        uint256 id,
        uint256 bid,
        address wallet
    ) public {
        allBuyers[wallet].request.push(id);
        requestLands memory newLand;
        allrequests[reqCounter] = newLand;
        allrequests[reqCounter].state = true;
        allrequests[reqCounter].bid = bid;
        allrequests[reqCounter].LandId = id;
         allrequests[reqCounter].reqId = reqCounter;
         allrequests[reqCounter].wallet = wallet;

        reqCounter++;
    }

    function approve(uint256 reqId, address approvedOwner) public {
        require(
            AdminWhitelist[msg.sender] == true,
            "Sorry You are not Authorised"
        );
        allLands[allrequests[reqId].LandId].CurrentOwner = approvedOwner;
        allLands[allrequests[reqId].LandId].status = Status.awaitingPayment;
        allrequests[reqId].state = false;
    }

    function transferLand(uint256 id, address receiver) public {
        require(msg.sender == allLands[id].CurrentOwner, "Not the Owner");
        allLands[id].Owners.push(receiver);
        allLands[id].CurrentOwner = receiver;
        safeTransferFrom(allLands[id].CurrentOwner, receiver, id);
    }

    function buy(uint256 id, uint256 price) public {
        require(
            msg.sender == allLands[id].CurrentOwner,
            "Sorry You are not Authorised"
        );
        allLands[id].status = Status.sold;
        uint256 decimals = 18;
        uint256 finalPrice = price * 10**decimals;
        token1.transferFrom(msg.sender, superAdmin, finalPrice);
        transferLand(id, msg.sender);
    }

    function putOnSale(uint256 id, uint256 price) public {
        require(
            msg.sender == allLands[id].CurrentOwner,
            "Sorry You are not Authorised"
        );
        allLands[id].status = Status.onSale;
        allLands[id].currPrice = price;
    }

    function addLand(
        string memory name,
        uint256 currPrice,
        string memory image,
        string memory metadata,
        string memory long,
        string memory lat
    ) public {
        require(
            AdminWhitelist[msg.sender] == true,
            "Sorry You are not Authorised"
        );
        uint256 id = Counter;

        Land memory newLand;
        newLand.id = id;
        newLand.name = name;
        newLand.CurrentOwner = msg.sender;
        newLand.currPrice = currPrice;
        newLand.long = long;
        newLand.lat = lat;
        newLand.metadata = metadata;
        newLand.imageURI = image;
        allLands[id] = newLand;
        allLands[id].status = Status.onSale;
        allLands[id].Owners.push(msg.sender);
        _mint(msg.sender, id);
        _setTokenURI(id, allLands[id].metadata);
        Counter++;
    }
}
