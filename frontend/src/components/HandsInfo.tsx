import React from "react";
import useStore from "../store";
import Card from "./Card";
import CardStack from "./CardStack";
import Section from "./Section";
import SectionHeading from "./SectionHeading";

const HandsInfo = () => {
  const cards = useStore(state => state.cards);
  const logic = useStore(state => state.logic);
  const hasFolded = useStore(state => state.hasFolded);

  return (
    <div className="border-t-4 border-solid border-brand-1-dark bg-brand-1 p-3 rounded row-span-2">
        
      <SectionHeading>
        Your top hands
      </SectionHeading>

      <div className="flex flex-col gap-2 overflow-y-auto h-full pb-5">
        {logic.ranks.sort((a, b) => b.percentage - a.percentage).filter(i => i.percentage > 0).map((rank) => (
          <div key={rank.name} className="w-full rounded bg-brand-1-dark p-2 text-2xl text-center">
            {rank.name}: {rank.percentage.toFixed(2)}%
          </div>
        ))}
      </div>

      {hasFolded && (
        <div className="absolute flex items-center justify-center top-0 left-0 w-full h-full bg-brand-1-dark bg-opacity-50">
          You are folded
        </div>
      )}

    </div>
  );
};
export default HandsInfo;