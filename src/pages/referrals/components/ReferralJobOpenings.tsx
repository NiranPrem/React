import EmptyState from "../../../shared/components/empty-state/EmptyState";
import AtsPaginator from "../../../shared/components/ats-pagination/Pagination";
import AtsLoader from "../../../shared/components/ats-loader/AtsLoader";
import JobCard from "./ReferralJobCard";
import type { JobInterface } from "../../../shared/interface/JobInterface";

interface Props {
	jobOpenings: JobInterface[];
	loading: boolean;
	totalCount: number;
	first: number;
	rows: number;
	onPageChange: (e: { first: number; rows: number }) => void;
}

const ReferralJobOpenings = ({
	jobOpenings,
	loading,
	totalCount,
	first,
	rows,
	onPageChange,
}: Props) => {
	return (
		<div>
			{loading && <AtsLoader />}
			<div
				style={{ height: "calc(100vh - 216px)", overflowY: "auto" }}
				className="gap-4 items-center bg-[#F6F6F6]  rounded-t-[24px] relative z-20 -mt-[60px]"
			>
				<div className="grid grid-cols-4 gap-2 p-5 ">
					{jobOpenings && jobOpenings.length > 0
						? jobOpenings.map((job) => (
							<JobCard key={job.jobOpportunityId} job={job} />
						))
						: null}
				</div>

				{jobOpenings && jobOpenings.length === 0 && !loading && (
					<div className="grid grid-cols-1 gap-2 p-5 ">
						<EmptyState />
					</div>
				)}
			</div>

			<AtsPaginator
				first={first}
				rows={rows}
				totalCount={totalCount || 0}
				onPageChange={onPageChange}
				hasDocuments={jobOpenings && jobOpenings.length > 0}
			/>
		</div>
	);
};

export default ReferralJobOpenings;
