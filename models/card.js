class Card
{
    constructor(id, userID, title, nameOnCard, type, number, cvv, expDate, folder, favorite)
    {
        this.id = id;
        this.userID = userID
        this.title = title;
        this.nameOnCard = nameOnCard;
        this.type = type;
        this.number = number;
        this.cvv = cvv;
        this.expDate = expDate;
        this.folder = folder;
        this.favorite = favorite;
    }
}

export default Card;