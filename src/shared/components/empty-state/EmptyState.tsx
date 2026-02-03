import noDataSvg from "../../../assets/images/no-data.svg";

const EmptyState = () => {
    return (
        <div className="flex flex-col text-center items-center justify-center py-16 w-full overflow-y-auto">
            <img src={noDataSvg} className="w-30 h-auto mb-6" />
            <p className="text-md mb-6">No data found.</p>
        </div>
    );
};

export default EmptyState;
