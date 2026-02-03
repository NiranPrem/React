import DetailsCard from "./DetailsCard";

type DetailField = {
  label: string;
  value: string | number | null | undefined;
};

interface DetailsCardProps {
  details: DetailField[];
  title?: string;
}

// Cards component to display a list of details in a card format
const Cards = ({ details, title }: DetailsCardProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-5 border-b border-[#F6F6F6] pb-2">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="mb-8">
        <DetailsCard details={details} />
      </div>
    </>
  );
};

export default Cards;
