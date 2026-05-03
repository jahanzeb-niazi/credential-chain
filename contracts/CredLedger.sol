// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CredLedger {
    address public immutable government;
    uint256 private nextCredentialId = 1;

    enum CredentialStatus { Active, Revoked }

    struct Credential {
        uint256 id;
        address student;
        address institution;
        string cid;
        CredentialStatus status;
        uint256 issuedAt;
        uint256 updatedAt;
        uint256 revokedAt;
        string revokeReason;
    }

    struct Regulator {
        string name;
        string jurisdiction;
        bool active;
        uint256 addedAt;
    }

    struct Institution {
        string name;
        string accreditationId;
        bool authorized;
        bool suspended;
        address regulator;
        uint256 authorizedAt;
    }

    mapping(address => Regulator) public regulators;
    mapping(address => Institution) public institutions;
    mapping(uint256 => Credential) private credentials;
    mapping(address => uint256[]) private studentCredentialIds;
    mapping(address => uint256[]) private institutionCredentialIds;
    address[] private regulatorList;
    address[] private institutionList;
    mapping(address => bool) private regulatorTracked;
    mapping(address => bool) private institutionTracked;

    event RegulatorAdded(address indexed regulator, string name, string jurisdiction, uint256 timestamp);
    event RegulatorRemoved(address indexed regulator, uint256 timestamp);
    event InstitutionAuthorized(address indexed institution, address indexed regulator, string name, string accreditationId, uint256 timestamp);
    event InstitutionSuspended(address indexed institution, address indexed regulator, uint256 timestamp);
    event InstitutionReactivated(address indexed institution, address indexed regulator, uint256 timestamp);
    event CredentialIssued(uint256 indexed credentialId, address indexed student, address indexed institution, string cid, uint256 timestamp);
    event CredentialUpdated(uint256 indexed credentialId, address indexed institution, string oldCid, string newCid, uint256 timestamp);
    event CredentialRevoked(uint256 indexed credentialId, address indexed institution, string reason, uint256 timestamp);

    modifier onlyGovernment() {
        require(msg.sender == government, "Only government");
        _;
    }

    modifier onlyRegulator() {
        require(regulators[msg.sender].active, "Only active regulator");
        _;
    }

    modifier onlyAuthorizedInstitution() {
        Institution memory institution = institutions[msg.sender];
        require(institution.authorized && !institution.suspended, "Institution not authorized");
        _;
    }

    modifier credentialExists(uint256 credentialId) {
        require(credentials[credentialId].id != 0, "Credential not found");
        _;
    }

    constructor() {
        government = msg.sender;
        regulators[msg.sender] = Regulator("Government Root", "GLOBAL", true, block.timestamp);
        regulatorList.push(msg.sender);
        regulatorTracked[msg.sender] = true;
        emit RegulatorAdded(msg.sender, "Government Root", "GLOBAL", block.timestamp);
    }

    function addRegulator(address regulator, string calldata name, string calldata jurisdiction) external onlyGovernment {
        require(regulator != address(0), "Invalid regulator");
        require(bytes(name).length > 0, "Name required");
        regulators[regulator] = Regulator(name, jurisdiction, true, block.timestamp);
        if (!regulatorTracked[regulator]) {
            regulatorList.push(regulator);
            regulatorTracked[regulator] = true;
        }
        emit RegulatorAdded(regulator, name, jurisdiction, block.timestamp);
    }

    function removeRegulator(address regulator) external onlyGovernment {
        require(regulator != government, "Cannot remove government");
        require(regulators[regulator].active, "Regulator inactive");
        regulators[regulator].active = false;
        emit RegulatorRemoved(regulator, block.timestamp);
    }

    function authorizeInstitution(address institution, string calldata name, string calldata accreditationId) external onlyRegulator {
        require(institution != address(0), "Invalid institution");
        require(bytes(name).length > 0, "Name required");
        require(bytes(accreditationId).length > 0, "Accreditation required");
        institutions[institution] = Institution(name, accreditationId, true, false, msg.sender, block.timestamp);
        if (!institutionTracked[institution]) {
            institutionList.push(institution);
            institutionTracked[institution] = true;
        }
        emit InstitutionAuthorized(institution, msg.sender, name, accreditationId, block.timestamp);
    }

    function suspendInstitution(address institution) external onlyRegulator {
        require(institutions[institution].authorized, "Institution unknown");
        require(institutions[institution].regulator == msg.sender || msg.sender == government, "Not institution regulator");
        institutions[institution].suspended = true;
        emit InstitutionSuspended(institution, msg.sender, block.timestamp);
    }

    function reactivateInstitution(address institution) external onlyRegulator {
        require(institutions[institution].authorized, "Institution unknown");
        require(institutions[institution].regulator == msg.sender || msg.sender == government, "Not institution regulator");
        institutions[institution].suspended = false;
        emit InstitutionReactivated(institution, msg.sender, block.timestamp);
    }

    function issueCredential(address student, string calldata cid) external onlyAuthorizedInstitution returns (uint256) {
        require(student != address(0), "Invalid student");
        require(bytes(cid).length > 0, "CID required");
        uint256 credentialId = nextCredentialId++;
        credentials[credentialId] = Credential({
            id: credentialId,
            student: student,
            institution: msg.sender,
            cid: cid,
            status: CredentialStatus.Active,
            issuedAt: block.timestamp,
            updatedAt: 0,
            revokedAt: 0,
            revokeReason: ""
        });
        studentCredentialIds[student].push(credentialId);
        institutionCredentialIds[msg.sender].push(credentialId);
        emit CredentialIssued(credentialId, student, msg.sender, cid, block.timestamp);
        return credentialId;
    }

    function updateCredential(uint256 credentialId, string calldata newCid) external credentialExists(credentialId) {
        Credential storage credential = credentials[credentialId];
        require(credential.institution == msg.sender, "Only issuing institution");
        require(credential.status == CredentialStatus.Active, "Credential revoked");
        require(bytes(newCid).length > 0, "CID required");
        string memory oldCid = credential.cid;
        credential.cid = newCid;
        credential.updatedAt = block.timestamp;
        emit CredentialUpdated(credentialId, msg.sender, oldCid, newCid, block.timestamp);
    }

    function revokeCredential(uint256 credentialId, string calldata reason) external credentialExists(credentialId) {
        Credential storage credential = credentials[credentialId];
        require(credential.institution == msg.sender, "Only issuing institution");
        require(credential.status == CredentialStatus.Active, "Already revoked");
        require(bytes(reason).length > 0, "Reason required");
        credential.status = CredentialStatus.Revoked;
        credential.revokedAt = block.timestamp;
        credential.revokeReason = reason;
        emit CredentialRevoked(credentialId, msg.sender, reason, block.timestamp);
    }

    function getCredential(uint256 credentialId) external view credentialExists(credentialId) returns (Credential memory) {
        return credentials[credentialId];
    }

    function verifyCredential(uint256 credentialId) external view credentialExists(credentialId) returns (Credential memory, Institution memory) {
        Credential memory credential = credentials[credentialId];
        return (credential, institutions[credential.institution]);
    }

    function getCredentialsByHolder(address student) external view returns (uint256[] memory) {
        return studentCredentialIds[student];
    }

    function getCredentialsByInstitution(address institution) external view returns (uint256[] memory) {
        return institutionCredentialIds[institution];
    }

    function isRegulator(address account) external view returns (bool) {
        return regulators[account].active;
    }

    function isAuthorizedInstitution(address account) external view returns (bool) {
        Institution memory institution = institutions[account];
        return institution.authorized && !institution.suspended;
    }

    function getAllRegulators() external view returns (address[] memory) {
        return regulatorList;
    }

    function getAllInstitutions() external view returns (address[] memory) {
        return institutionList;
    }

    function getRegulator(address account) external view returns (Regulator memory) {
        return regulators[account];
    }

    function getInstitution(address account) external view returns (Institution memory) {
        return institutions[account];
    }
}
