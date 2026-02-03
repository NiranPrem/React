import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import "./CustomConfirmDialog.css";
import { useTranslation } from "react-i18next";

type Props = {
	visible: boolean;
	title?: string;
	subTitle?: string;
	icon?: string;
	isConfirmationModal?: boolean;
	onHide: () => void;
	onConfirm: () => void;
};

const CustomConfirmDialog: React.FC<Props> = ({
	visible,
	title,
	subTitle,
	icon,
	isConfirmationModal,
	onHide,
	onConfirm,
}) => {
	const { t } = useTranslation();
	const footer = (
		<div className="flex justify-end gap-2 mt-4">
			<Button
				type="button"
				label={t("common.no")}
				onClick={onHide}
				className="p-button-outlined p-button-sm"
			/>
			<Button
				type="button"
				label={t("common.yes")}
				onClick={onConfirm}
				className="p-button-sm"
				style={{ backgroundColor: "#3B82F6", borderColor: "#3B82F6" }}
			/>
		</div>
	);

	return (
		<Dialog
			visible={visible}
			onHide={onHide}
			header={null}
			footer={footer}
			className="custom-dialog w-[90%] md:w-[400px] rounded-lg"
			closable
			closeOnEscape
			dismissableMask>
			<div className="flex items-center gap-3 text-left">
				{isConfirmationModal ? (
					""
				) : (
					<div className="bg-[#FFECEC] p-3 rounded">
						<img src={icon} className="w-6 h-6" alt="Delete" />
					</div>
				)}
				<div>
					<h2 className="text-lg font-semibold mb-1">{title}</h2>
					<p
						className={
							isConfirmationModal
								? "text-lg text-gray-600"
								: "text-sm text-gray-600"
						}>
						{subTitle}
					</p>
				</div>
			</div>
		</Dialog>
	);
};

export default CustomConfirmDialog;
