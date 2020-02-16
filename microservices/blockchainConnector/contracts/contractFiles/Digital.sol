pragma solidity ^0.4.26;

contract Digital {
    address public owner;
    struct Data {
        string dataType;
        string ipfsHash;
        string dataHash;
        bool isVerified;
    }
    struct user {
        string name;
        string email;
        Data[] identity;
        Data[] document;
    }
    mapping(address => user) userDetail;

    event AddUser(
        address indexed addr,
        string indexed name,
        string indexed email
    );
    event AddIdentity(
        address indexed addr,
        string idType,
        string ipfsHash,
        string dataHash,
        uint256 index
    );
    event AddDocument(
        address indexed addr,
        string docType,
        string ipfsHash,
        string dataHash,
        uint256 index
    );
    event VerifyIdentity(
        address indexed verifiedBy,
        address indexed addr,
        string idType,
        uint256 indexed index
    );
    event VerifyDocument(
        address indexed verifiedBy,
        address indexed addr,
        string idType,
        uint256 indexed index
    );

    constructor() {
        owner = msg.sender;
    }

    modifier isOwner() {
        require(owner == msg.sender, "Access Denied");
        _;
    }

    function addUser(address _addr, string _name, string _email) public {
        userDetail[_addr].email = _email;
        userDetail[_addr].name = _name;
        emit AddUser(_addr, _name, _email);
    }

    function addIdentity(string _idType, string _ipfsHash, string _dataHash)
        public
    {
        userDetail[msg.sender].identity.push(
            Data(_idType, _ipfsHash, _dataHash, false)
        );
        emit AddIdentity(
            msg.sender,
            _idType,
            _ipfsHash,
            _dataHash,
            userDetail[msg.sender].identity.length-1
        );
    }

    function addDocument(string _docType, string _ipfsHash, string _dataHash)
        public
    {
        userDetail[msg.sender].document.push(
            Data(_docType, _ipfsHash, _dataHash, false)
        );
        emit AddDocument(
            msg.sender,
            _docType,
            _ipfsHash,
            _dataHash,
            userDetail[msg.sender].document.length-1
        );
    }

    function verifyIdentity(address _addr, uint256 _index) public {
        require(_addr != msg.sender, "Access Denied");
        userDetail[_addr].identity[_index].isVerified = true;
        emit VerifyIdentity(
            msg.sender,
            _addr,
            userDetail[_addr].identity[_index].dataType,
            _index
        );
    }

    function verifyDocument(address _addr, uint256 _index) public {
        require(_addr != msg.sender, "Access Denied");
        userDetail[_addr].document[_index].isVerified = true;
        emit VerifyDocument(
            msg.sender,
            _addr,
            userDetail[_addr].document[_index].dataType,
            _index
        );
    }

    function getUser(address _addr) public view returns (string, string) {
        return (userDetail[_addr].email, userDetail[_addr].name);
    }

    function getIdentity(address _addr, uint256 _index)
        public
        view
        returns (string, string, string, bool)
    {
        return (
            userDetail[_addr].identity[_index].dataType,
            userDetail[_addr].identity[_index].ipfsHash,
            userDetail[_addr].identity[_index].dataHash,
            userDetail[_addr].identity[_index].isVerified
        );
    }

    function getDocument(address _addr, uint256 _index)
        public
        view
        returns (string, string, string, bool)
    {
        return (
            userDetail[_addr].document[_index].dataType,
            userDetail[_addr].document[_index].ipfsHash,
            userDetail[_addr].document[_index].dataHash,
            userDetail[_addr].document[_index].isVerified
        );
    }

    function getTotalIdentity() public view returns (uint256) {
        return (userDetail[msg.sender].identity.length);
    }

    function getTotalDocument() public view returns (uint256) {
        return (userDetail[msg.sender].document.length);
    }
}
