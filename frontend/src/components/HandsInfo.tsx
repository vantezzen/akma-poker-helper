import React, { forwardRef, useState } from "react";
import { ArrowDown, LogOut } from "react-feather";
import FlipMove from 'react-flip-move';
import useStore from "../store";
import Card from "./Card";
import CardStack from "./CardStack";
import Section from "./Section";
import SectionHeading from "./SectionHeading";

const HandsInfo = () => {
  const cards = useStore(state => state.cards);
  const logic = useStore(state => state.logic);
  const hasFolded = useStore(state => state.hasFolded);
  const [useSorting, setUseSorting] = useState(false);

  const rankImportance = {
    'Royal Flush': 100,
    'Straight Flush': 90,
    '4 of a kind': 80,
    'Full House': 70,
    'Flush': 60,
    'Straight': 50,
    '3 of a kind': 40,
    'Two Pairs': 30,
    'One Pair': 20,
    'High Card': 10,
  }

  const ranks = useSorting ? [...logic.ranks].sort((a, b) => b.percentage - a.percentage) : [...logic.ranks];

  return (
    <div className="border-t-4 border-solid border-brand-1-dark bg-brand-1 p-3 rounded row-span-2">
        
      <SectionHeading>
        Your top hands
        <span className={`float-right cursor-pointer ${useSorting ? 'text-orange-600' : 'text-gray-500'}`} onClick={() => {
          setUseSorting(!useSorting);
        }} title="Sort by rank or percentage">
          <ArrowDown />
        </span>
      </SectionHeading>

      <div >
        <FlipMove duration={1000} className="overflow-y-auto h-full pb-5 duration-200">
          {ranks.filter(i => i.percentage > 0).map((rank) => (
            <div key={rank.name} className="mb-2 w-full rounded bg-brand-1-dark p-2 text-2xl text-center duration-100">
              {rank.name} (Score {rankImportance[rank.name as keyof typeof rankImportance] ?? 'N/A'}): {rank.percentage.toFixed(2)}%
            </div>
          ))}
        </FlipMove>
      </div>

      {hasFolded && (
        <div className="absolute flex flex-col gap-6 items-center justify-center top-0 left-0 w-full h-full bg-brand-1-dark bg-opacity-70">
          <LogOut size={50} />
          You are folded
        </div>
      )}

    </div>
  );
};
export default HandsInfo;