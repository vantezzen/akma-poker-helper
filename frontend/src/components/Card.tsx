import React from "react";

export type CardSuit = "hearts" | "diamonds" | "spades" | "clubs";
export type CardRank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";
export type CardData = {
  suit: CardSuit,
  rank: CardRank,
}

const suits = {
  hearts: "♥",
  diamonds: "♦",
  spades: "♠",
  clubs: "♣"
};

const Card = ({ height, suit, rank, className } : { height: number, suit?: CardSuit, rank?: CardRank, className?: string }) => {
  return (
    <div 
      className={`h-${height} rounded text-brand-1 flex items-center justify-center text-xl font-black ` + (suit && rank ? " bg-brand-2 ": " bg-brand-1-dark ") + className}
    >
      {suit && rank ? `${suits[suit]} ${rank}` : "?"}
    </div>
  );
};
export default Card;