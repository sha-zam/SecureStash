class Bank
{
    constructor(id, userID, bankName, accType, accNum, pin, branchAddr, branchPhone, folder, favorite)
    {
        this.id = id;
        this.userID = userID
        this.bankName = bankName;
        this.accType = accType;
        this.accNum = accNum;
        this.pin = pin;
        this.branchAddr = branchAddr;
        this.branchPhone = branchPhone;
        this.folder = folder;
        this.favorite = favorite;
    }
}

export default Bank;