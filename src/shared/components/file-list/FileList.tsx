import CloseSvg from "../../../assets/icons/x-close.svg";
import DocWithTickSvg from "../../../assets/icons/doc-with-tick.svg";
interface FileListProps {
  File: { name: string }[];
  Confirm: (index: number) => void;
}

const FileList = ({ File, Confirm }: FileListProps) => {
  return (
    <ul className="mt-3 flex flex-wrap gap-2 w-full">
      {File?.map((file, index) => (
        <li
          key={file.name + index}
          className="flex items-center justify-between border border-[#F6F6F6] rounded-md p-2 shadow-sm transition-all bg-gray-100"
        >
          <div className="flex items-center gap-2">
            <img src={DocWithTickSvg} alt="file" className="w-4 h-4" />
            <span
              className="truncate max-w-[150px] text-sm text-gray-900"
              title={file.name}
            >
              {file.name}
            </span>
          </div>
          <button
            type="button"
            className="ml-2 flex rounded-md hover:bg-gray-200 p-1 cursor-pointer"
            onClick={() => Confirm(index)}
            title="Delete file"
          >
            <img src={CloseSvg} className="w-4 h-4" alt="Delete" />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default FileList;
