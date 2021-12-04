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
    <div className="bg-brand-1 m-3 rounded row-span-2">
        
      <SectionHeading>
        Your top hands
      </SectionHeading>

      <div className="flex flex-col gap-2 overflow-y-auto h-full pb-5">
        {logic.ranks.sort((a, b) => b.percentage - a.percentage).map((rank) => (
          <div key={rank.name} className="w-full rounded bg-brand-1-dark p-2 text-2xl text-center">
            {rank.name}: {rank.percentage.toFixed(2)}%
          </div>
        ))}
      </div>

    </div>
  );
};
export default HandsInfo;