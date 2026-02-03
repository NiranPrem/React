interface ToggleSegmentProps {
  value: "0" | "1";
  onChange: (value: "0" | "1") => void;
  labelOne?: string;
  labelTwo?: string;
}

const ToggleSegment = ({
  value,
  onChange,
  labelOne,
  labelTwo,
}: ToggleSegmentProps) => {
  return (
    <div className="inline-flex items-center bg-[#2D4D9A] p-1 rounded-full border border-[#1B326B]">
      <button
        type="button"
        onClick={() => onChange("0")}
        className={`px-4 py-1.5 rounded-full text-sm font-light transition-all duration-200 cursor-pointer
          ${value === "0"
            ? "bg-[#4278F9] text-white"
            : "text-white/70 hover:text-white"
          }`}
      >
        {labelOne}
      </button>
      <button
        type="button"
        onClick={() => onChange("1")}
        className={`px-4 py-1.5 rounded-full text-sm font-light transition-all duration-200 cursor-pointer
          ${value === "1"
            ? "bg-[#4278F9] text-white"
            : "text-white/70 hover:text-white"
          }`}
      >
        {labelTwo}
      </button>
    </div>
  );
};

export default ToggleSegment;
