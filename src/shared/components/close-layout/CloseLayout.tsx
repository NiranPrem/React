import { useNavigate } from "react-router-dom";
import closeLogo from "../../../assets/icons/x-close.svg";

type StateProps = {
  title?: string;
  close?: string | number;
};

// Component for displaying a close button with a title
const CloseLayout = ({ title = "No data found.", close = -1 }: StateProps) => {
  const navigate = useNavigate();

  // Function to handle navigation when close button is clicked
  const handleNavigate = () => {
    if (close === -1) {
      navigate(-1);
    } else if (typeof close === "string") {
      navigate(close);
    }
  };
  return (
    <div className="flex justify-between items-center p-4 border-b bg-white border-[#EFEFEF]">
      <h1 className="text-[22px] font-semibold truncate max-w-[calc(100vw-200px)]">
        {title}
      </h1>
      <button
        type="button"
        className="rounded-lg hover:bg-[#F6F6F6] p-2 cursor-pointer"
        onClick={handleNavigate}
      >
        <img src={closeLogo} className="w-7 h-7" alt="close" />
      </button>
    </div>
  );
};

export default CloseLayout;
