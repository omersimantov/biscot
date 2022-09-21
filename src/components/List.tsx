import { PencilIcon } from "@heroicons/react/24/outline";
import { Card } from "./Card";

export type List = {
  id: string;
  title: string;
  cards: Card[];
};

export const List = ({ title, cards }: List): JSX.Element => {
  return (
    <div className="px-10 border-r border-neutral-700 group">
      <div className="flex items-center justify-between mb-5 cursor-pointer">
        <h1 className="text-lg font-bold">{title}</h1>
        <PencilIcon
          className="w-4 text-neutral-500 hover:text-white ml-4 group-hover:block hidden"
          onClick={(): void => alert("Edit List Modal")}
        />
      </div>
      <div>
        {cards.map((card) => (
          <Card key={card.id} id={card.id} listId={card.listId} title={card.title} description={card.description} />
        ))}
        <div className="hover:bg-neutral-800 rounded-xl p-4 text-center font-medium cursor-pointer min-w-full w-72">
          + Add
        </div>
      </div>
    </div>
  );
};
