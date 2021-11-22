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

const Card = ({ suit, rank, className } : { suit?: CardSuit, rank?: CardRank, className?: string }) => {
  return (
    <div 
      className={`h-full rounded text-brand-1 flex items-center justify-center text-xl font-black ` + (suit && rank ? " bg-brand-2 ": " bg-brand-1-dark ") + className}
    >
      {suit && rank ? (
        <>
          <span className={ suit === "hearts" || suit === "diamonds" ? 'text-red-800' : '' }>
            {suits[suit]}
          </span>
          {rank}
        </>
      ) : "?"}
      <span>

      </span>
    </div>
  );
};
export default Card;