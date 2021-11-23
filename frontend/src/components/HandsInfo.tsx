import React from "react";
import useStore from "../store";
import Card from "./Card";
import CardStack from "./CardStack";
import Section from "./Section";
import SectionHeading from "./SectionHeading";

const HandsInfo = () => {
  const cards = useStore(state => state.cards);
  const logic = useStore(state => state.logic);

  return (
    <div className="border-t-4 border-solid border-brand-1-dark grid grid-cols-2 gap-1 bg-brand-1-dark">
        
      <Section>
        <SectionHeading>
          Current best hand
        </SectionHeading>
        <div className="grid grid-cols-4 h-full justify-center items-center gap-4">
          <CardStack items={logic.bestHand.cards.length} className="col-span-3">
            {logic.bestHand.cards.map((card, index) => (
              <Card key={index} {...card} />
            ))}
          </CardStack>
          <span className="font-bold">
            {logic.bestHand.name || 'Nothing yet'}
          </span>
        </div>
      </Section>

      <Section>
        <SectionHeading>
          Let's hope for
        </SectionHeading>

        <div className="grid grid-cols-2">
          <Card {...logic.hopeFor.card} />
          <div className="flex h-full justify-center items-center">
            <span>
              For<br />
              <span className="font-bold">
                {logic.hopeFor.name || 'Unknown'}
              </span>
            </span>
          </div>
        </div>
      </Section>

    </div>
  );
};
export default HandsInfo;