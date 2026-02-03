import { useTranslation } from "react-i18next";

// Data formatting and utility functions for the ATS application
export const formatDate = (
	dateStr?: string | Date,
	t?: (key: string) => string
) => {
	if (!dateStr) return t ? t("common.none") : "None";
	const date = new Date(dateStr);
	if (isNaN(date.getTime())) return "Invalid Date";
	return new Intl.DateTimeFormat("en-GB").format(date); // DD/MM/YYYY
};

export const formatDay = (dateStr?: string): string => {
	if (!dateStr) return "";
	const date = new Date(dateStr);
	return date.toLocaleDateString("en-US", { weekday: "long" });
};

// This function formats a date string to "DD/MM/YYYY HH:MM AM/PM" format
export const formatDateTime = (
	dateStr?: string | Date,
	t?: (key: string) => string
) => {
	if (!dateStr) return t ? t("common.none") : "None";
	const date = new Date(dateStr);
	if (isNaN(date.getTime())) return "Invalid Date";

	const day = date.getDate().toString().padStart(2, "0");
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const year = date.getFullYear();

	let hours = date.getHours();
	const minutes = date.getMinutes().toString().padStart(2, "0");
	const period = hours >= 12 ? "PM" : "AM";

	hours = hours % 12;
	if (hours === 0) hours = 12;

	return `${day}/${month}/${year} ${hours}:${minutes} ${period}`;
};

// Pagiantion options for dropdowns
export const dropdownOptions = [
	{ label: 10, value: 10 },
	{ label: 15, value: 15 },
	{ label: 20, value: 20 },
	{ label: 25, value: 25 },
	{ label: 30, value: 30 },
	{ label: 35, value: 35 },
	{ label: 40, value: 40 },
	{ label: 45, value: 45 },
	{ label: 50, value: 50 },
];

// This function formats a list of skills into a comma-separated string
export const skillList = (skills?: string[], t?: (key: string) => string) => {
	if (skills?.length === 0) return t ? t("common.none") : "None";
	return skills?.join(", ");
};

//
export const labelList = (
	items?: { label: string }[],
	t?: (key: string) => string
) => {
	if (!items || items.length === 0) return t ? t("common.none") : "None";
	return items.map((item) => item.label).join(", ");
};

// This function formats a list of tags into a comma-separated string
export const HTMLFormat = (text?: string) => {
	const { t } = useTranslation();
	if (!text) return t("common.none");
	const tempElement = document.createElement("div");
	tempElement.innerHTML = text;
	const plainText = tempElement.innerText || "";
	return plainText;
};

export const HTMLFormatComment = (text?: string) => {
	if (!text) return "";
	const tempElement = document.createElement("div");
	tempElement.innerHTML = text;
	return tempElement.innerText || "";
};

// This function converts a file to a base64 string
export const fileToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			if (typeof reader.result === "string") {
				// Remove the data URL prefix (everything before and including the comma)
				const base64 = reader.result.split(",")[1];
				resolve(base64);
			} else {
				reject(new Error("Failed to read file as base64"));
			}
		};
		reader.onerror = (error) => reject(error);
	});
};

// This function determines the content type based on the file format
export function ContentType(format: string): string {
	if (format.includes("pdf")) {
		return "Pdf";
	} else if (format.includes("wordprocessingml")) {
		return "Docx";
	} else if (format.includes("spreadsheetml")) {
		return "Xlsx";
	} else if (format.includes("presentationml")) {
		return "Pptx";
	} else {
		return "Other";
	}
}

export const getStatusClasses = (statusId: number) => {
	switch (statusId) {
		case 1:
			return "bg-[#FFF0D4] text-[#CB6701]"; // yellow
		case 2:
			return "bg-[#E6F6EB] text-[#027A27]"; // green
		case 3:
			return "bg-[#FFECEC] text-[#e7000b]"; // red
		case 4:
			return "bg-[#0a38b729] text-[#0a38b7]"; // blue
		case 5:
			return "bg-[#f973162e] text-[#f97316]"; // orange
		case 6:
			return "bg-[#eeff9c87] text-[#677b08]"; // lime
		default:
			return "bg-[#F6F6F6] text-gray-600"; // Unknown
	}
};

export const getUserStatusClasses = (statusId: number) => {
	switch (statusId) {
		case 1:
			// Invited
			return "bg-[#f6de95] text-[#CB6701]";
		case 2:
			// Active
			return "bg-[#22c55e40] text-[#008000]";
		case 3:
			// Inactive
			return "bg-[#F6F6F6] text-gray-600";
		case 4:
			// Invitation Revoked
			return "bg-[#ff000042] text-[#ff0000]";
		case 5:
			// Invitation Expired
			return "bg-[#ff000042] text-[#ff0000]";
		default:
			return "bg-[#F6F6F6] text-gray-600"; // Unknown
	}
};

export const msalConfig = {
	auth: {
		clientId: import.meta.env.VITE_ATS_MS_CLIENTID,
		authority: import.meta.env.VITE_ATS_MS_AUTHORITY,
		redirectUri: window.location.origin, // ✅ use this in dev & prod
		postLogoutRedirectUri: window.location.origin,
	},
};

export const loginAzureRequest = {
	scopes: ["openid", "profile", "User.Read"],
	prompt: "select_account",
};

export const apiRequest = {
	scopes: [import.meta.env.VITE_ATS_MS_SCOPES],
};
