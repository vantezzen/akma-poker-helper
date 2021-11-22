import React from "react";
import useStore from "../store";
import Card from "./Card";
import CardStack from "./CardStack";
import Section from "./Section";
import SectionHeading from "./SectionHeading";

const CurrentCardsDisplay = () => {
  const cards = useStore(state => state.cards);

  return (
    <div className="grid grid-cols-7 gap-1 bg-brand-1-dark">
      <Section className="col-span-5">
        <SectionHeading>On desk</SectionHeading>

        <CardStack items={5}>
          {cards.desk.map((card, index) => (
            <Card key={index} {...card} />
          ))}
          {[...Array(5 - cards.desk.length)].map((_, index) => (
            <Card key={index} />
          ))}
        </CardStack>
      </Section>

      <Section className="col-span-2">
        <SectionHeading>Your hand</SectionHeading>

        <CardStack items={2}>
          {cards.hand.map((card, index) => (
            <Card key={index} {...card} />
          ))}
          {[...Array(2 - cards.hand.length)].map((_, index) => (
            <Card key={index} />
          ))}
        </CardStack>
      </Section>
    </div>
  );
};
export default CurrentCardsDisplay;