class Card:
    def __init__(self, suit: str, rank: str):
        self.rank = rank
        self.suit = suit
        self.validate()

    allowed_suits = ["hearts", "diamonds", "spades", "clubs"]
    allowed_ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

    def validate(self):
        if self.suit not in self.allowed_suits or self.rank not in self.allowed_ranks:
            raise ValueError()
