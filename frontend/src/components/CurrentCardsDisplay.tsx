import React from "react";
import useStore from "../store";
import Card from "./Card";
import Section from "./Section";
import SectionHeading from "./SectionHeading";

const CurrentCardsDisplay = () => {
  const cards = useStore(state => state.cards);

  return (
    <div className="grid grid-cols-7 gap-1 bg-brand-1-dark">
      <Section className="col-span-5">
        <SectionHeading>On desk</SectionHeading>

        <div className="grid grid-cols-5 gap-3">
          {cards.desk.map((card, index) => (
            <Card key={index} {...card} height={24} />
          ))}
          {[...Array(5 - cards.desk.length)].map((_, index) => (
            <Card key={index} height={24} />
          ))}
        </div>
      </Section>

      <Section className="col-span-2">
        <SectionHeading>Your hand</SectionHeading>

        <div className="grid grid-cols-2 gap-3">
          {cards.hand.map((card, index) => (
            <Card key={index} {...card} height={24} />
          ))}
          {[...Array(2 - cards.hand.length)].map((_, index) => (
            <Card key={index} height={24} />
          ))}
        </div>
      </Section>
    </div>
  );
};
export default CurrentCardsDisplay;