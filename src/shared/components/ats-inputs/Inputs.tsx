import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import CalenderLogo from "../../../assets/icons/calendar.svg";
import "./Input.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Checkbox } from "primereact/checkbox";
import { Editor } from "primereact/editor";
import { useTranslation } from "react-i18next";
import { locale, addLocale } from "primereact/api";
import { RadioButton } from "primereact/radiobutton";

type InputTextFieldProps = {
  label: string;
  valueKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: Record<string, unknown> | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  required?: boolean;
  type?: "text" | "email";
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  showError?: boolean;
  allowedPattern?: RegExp;
  errorMessage?: string;
};

export const InputTextField = ({
  label,
  valueKey,
  formData,
  setFormData,
  required = false,
  type = "text", // default to text
  placeholder,
  disabled = false,
  min = 0,
  max,
  allowedPattern,
  showError = false,
  errorMessage,
}: InputTextFieldProps) => {
    const { t } = useTranslation();
    const value =
        formData[valueKey] !== undefined && formData[valueKey] !== null
            ? String(formData[valueKey])
            : "";
    const isRequiredInvalid = showError && required && !value;
    const isEmailFormatInvalid =
        type === "email" &&
        value.length > 0 &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const isTooShort = min > 0 && value.length > 0 && value.length < min;

  const isTooLong = max ? value.length > max : false;
  const isInvalid =
    isRequiredInvalid ||
    isEmailFormatInvalid ||
    isTooShort ||
    isTooLong ||
    !!errorMessage;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (allowedPattern) {
      if (newValue === "" || allowedPattern.test(newValue)) {
        setFormData({ ...formData, [valueKey]: newValue });
      }
    } else {
      setFormData({ ...formData, [valueKey]: newValue });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const newValue = e.target.value.trim();
    setFormData({ ...formData, [valueKey]: newValue });
  };

    return (
        <div className="input-text-field">
            <label className="block mb-1 text-black">
                {label} {required && <span>*</span>}
            </label>
            <InputText
                type={type}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                className={"w-full"} // Add error class
                placeholder={`${t("common.enter")} ${placeholder ?? label.toLowerCase()
                    }`}
                disabled={disabled}
                invalid={isInvalid}
            />
            {/* Display error */}
            {isEmailFormatInvalid && (
                <small className="text-red-500 text-xs">
                    {t("common.enterValidEmailAddress")}
                </small>
            )}
            {isTooLong && (
                <small className="text-red-500 text-xs block mt-1">
                    {t("common.maximumCharacterLimitIs")} {max}.
                </small>
            )}
            {errorMessage && (
                <small className="text-red-500 text-xs block mt-1">
                    {errorMessage}
                </small>
            )}
        </div>
    );
};

type InputTextAreaProps = {
  label: string;
  valueKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: Record<string, unknown | any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  showLength?: boolean;
};

export const InputTextArea = ({
  label,
  valueKey,
  formData,
  setFormData,
  required = false,
  rows = 4,
  maxLength,
  showLength = false,
}: InputTextAreaProps) => {
    const { t } = useTranslation();
    return (
        <div className="mb-3">
            <label className="block mb-1 text-black">
                {label} {required && <span>*</span>}
            </label>
            <InputTextarea
                value={typeof formData[valueKey] === "string" ? formData[valueKey] : ""}
                onChange={(e) =>
                    setFormData({ ...formData, [valueKey]: e.target.value })
                }
                className="w-full"
                rows={rows}
                autoResize
                maxLength={maxLength}
                placeholder={`${t("common.enter")} ${label.toLowerCase()}`}
                invalid={required && !formData[valueKey]}
            />
            {showLength && (
                <div className="text-right text-gray-400">
                    {typeof formData[valueKey] === "string"
                        ? formData[valueKey].length
                        : 0}
                    /{maxLength}
                </div>
            )}
        </div>
    );
};

type DropdownFieldProps = {
  label?: string;
  valueKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: Record<string, unknown> | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  required?: boolean;
  placeholder?: string;
  filter?: boolean;
  disabled?: boolean;
  showError?: boolean;
};

export const DropdownField = ({
  label,
  valueKey,
  options,
  formData,
  setFormData,
  required = false,
  placeholder,
  filter = true,
  disabled = false,
  showError = false,
}: DropdownFieldProps) => {
    const { t } = useTranslation();
    return (
        <div className={`relative ${disabled ? "cursor-ban" : ""}`}>
            <label className="block mb-1 text-black">
                {label} {required && <span>*</span>}
            </label>
            <Dropdown
                value={formData[valueKey] ?? null}
                onChange={(e) => setFormData({ ...formData, [valueKey]: e.value })}
                options={options}
                placeholder={`${t("common.select")} ${placeholder ?? label?.toLowerCase()
                    }`}
                filter={filter}
                appendTo="self" //
                invalid={showError && required && !formData[valueKey]}
                className="w-full md:w-14rem"
                disabled={disabled}
                resetFilterOnHide
                showClear
            />
        </div>
    );
};

type InputNumberFieldProps = {
  label: string;
  valueKey: string;
  formData: Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  required?: boolean;
  min?: number;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  setIsValid?: (isValid: boolean) => void;
};

export const InputNumberField = ({
  label,
  valueKey,
  formData,
  setFormData,
  required = false,
  min,
  maxLength,
  placeholder,
  disabled = false,
  setIsValid,
}: InputNumberFieldProps) => {
  const { t } = useTranslation();
  const isTooLong =
    maxLength !== undefined &&
    formData[valueKey] !== undefined &&
    String(formData[valueKey]).length > maxLength;
  const isEmpty =
    formData[valueKey] === undefined || formData[valueKey] === null;
  let inputValue: number | null;
  if (typeof formData[valueKey] === "number") {
    inputValue = formData[valueKey];
  } else if (formData[valueKey] === undefined || formData[valueKey] === null) {
    inputValue = null;
  } else {
    inputValue = Number(formData[valueKey]);
  }

  const isInvalid = (required && isEmpty) || (!isEmpty && isTooLong);

  useEffect(() => {
    if (setIsValid) {
      setIsValid(!isInvalid);
    }
  }, [isInvalid, setIsValid]);

  return (
    <div>
      <label className={`block mb-1 text-black`}>{label}</label>
      <InputNumber
        value={inputValue}
        onChange={(e) => setFormData({ ...formData, [valueKey]: e.value })}
        mode="decimal"
        minFractionDigits={0}
        maxFractionDigits={4}
        step={0.0001}
        useGrouping={false}
        placeholder={`${t("common.enter")} ${
          placeholder ?? label.toLowerCase()
        }`}
        min={min}
        className="w-full"
        invalid={required && !formData[valueKey]}
        disabled={disabled}
      />
      {!isEmpty && isTooLong && (
        <small className="text-red-500 text-xs block mt-1">
          {t("common.maximumCharacterLimitIs")} {maxLength}.
        </small>
      )}
    </div>
  );
};

// Define German locale
addLocale("de", {
    firstDayOfWeek: 1,
    dayNames: [
        "Sonntag",
        "Montag",
        "Dienstag",
        "Mittwoch",
        "Donnerstag",
        "Freitag",
        "Samstag",
    ],
    dayNamesShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    dayNamesMin: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    monthNames: [
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember",
    ],
    monthNamesShort: [
        "Jan",
        "Feb",
        "Mär",
        "Apr",
        "Mai",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Okt",
        "Nov",
        "Dez",
    ],
    today: "Heute",
    clear: "Löschen",
    dateFormat: "dd.mm.yy",
    weekHeader: "KW",
});

// Define English GB locale
addLocale("en-GB", {
    firstDayOfWeek: 1,
    dayNames: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ],
    monthNamesShort: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ],
    today: "Today",
    clear: "Clear",
    dateFormat: "dd/mm/yy",
    weekHeader: "Wk",
});

type DateFieldProps = {
    label: string;
    valueKey: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: Record<string, unknown> | any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
    showError?: boolean;
    required?: boolean;
};

export const DateField = ({
    label,
    valueKey,
    formData,
    setFormData,
    disabled = false,
    required = false,
    minDate,
    maxDate,
    showError = false,
}: DateFieldProps) => {
    const { i18n } = useTranslation();
    // Apply locale dynamically
    locale(i18n.language === "de" ? "de" : "en-GB");
    const currentValue =
        formData[valueKey] &&
            (typeof formData[valueKey] === "string" ||
                typeof formData[valueKey] === "number")
            ? new Date(formData[valueKey])
            : null;

    const [calendarKey, setCalendarKey] = useState(0);

    return (
        <div>
            <label
                className={`block ${disabled ? "opacity-60" : ""} text-black mb-1`}
            >
                {label} {required && <span>*</span>}
            </label>
            <div className="relative">
                <Calendar
                    value={currentValue}
                    onChange={(e) => {
                        const date = e.value as Date;
                        setFormData({
                            ...formData,
                            [valueKey]: date?.toISOString() || null,
                        });
                    }}
                    dateFormat={i18n.language === "de" ? "dd.mm.yy" : "dd/mm/yy"}
                    placeholder={i18n.language === "de" ? "TT.MM.JJ" : "DD/MM/YY"}
                    disabled={disabled}
                    className="w-full"
                    appendTo="self"
                    invalid={showError && required && !formData[valueKey]}
                    minDate={minDate}
                    maxDate={maxDate}
                    key={calendarKey}
                    onHide={() => setCalendarKey((prev) => prev + 1)}
                    inputId={valueKey}
                    inputClassName="cursor-pointer"
                />
                <label
                    htmlFor={valueKey}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 z-50 ${disabled ? "opacity-50 pointer-events-none" : "!cursor-pointer"
                        }`}
                >
                    <img
                        src={CalenderLogo}
                        alt="calendar"
                        className={`w-5 h-5 ${disabled ? "" : "!cursor-pointer"}`}
                    />
                </label>
            </div>
        </div>
    );
};

type PhoneFieldProps = {
    label: string;
    valueKey: string;
    formData: Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    required?: boolean;
    setIsValid?: (isValid: boolean) => void;
};

export const PhoneField = ({
    label,
    valueKey,
    formData,
    setFormData,
    required = false,
    setIsValid,
}: PhoneFieldProps) => {
    const { t } = useTranslation();
    const [isValidLength, setIsValidLength] = useState(true);

    const value =
        typeof formData[valueKey] === "string" ? formData[valueKey] : "";
    const isEmpty = !value || value === "" || value === "91";
    // Invalid if required and empty, OR if length is invalid (and not just empty/default)
    const isInvalid = (required && isEmpty) || (!isEmpty && !isValidLength);
    const displayValue = value || "91";

    useEffect(() => {
        if (setIsValid) {
            setIsValid(!isInvalid);
        }
    }, [isInvalid, setIsValid]);

    return (
        <div>
            <label htmlFor={valueKey} className="block mb-1 text-black">
                {label} {required && <span>*</span>}
            </label>
            <PhoneInput
                country="in"
                value={displayValue}
                onChange={(phone, country: any) => {
                    // Calculate expected length based on format
                    // country.format e.g. "+.. ...-..." -> count dots
                    const expectedLength = (country.format.match(/\./g) || []).length;
                    // Check if length matches (if country format exists)
                    if (expectedLength > 0) {
                        setIsValidLength(phone.length === expectedLength);
                    } else {
                        setIsValidLength(true);
                    }

                    if (!phone || phone === "" || phone === "91") {
                        setFormData((prev: Record<string, unknown>) => ({
                            ...prev,
                            [valueKey]: "91",
                        }));
                    } else {
                        setFormData((prev: Record<string, unknown>) => ({
                            ...prev,
                            [valueKey]: phone,
                        }));
                    }
                }}
                inputProps={{ name: valueKey, id: valueKey }}
                containerClass="w-full"
                inputClass={`w-full h-10 px-3 py-2 text-sm border ${isInvalid ? "border-red-500" : "border-gray-300"
                    } rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500`}
                buttonClass="border-r border-gray-300"
            />
            {required && isEmpty && (
                <small className="text-red-500 text-xs block">
                    {t("common.phoneNumberRequired")}
                </small>
            )}
            {!isEmpty && !isValidLength && (
                <small className="text-red-500 text-xs">
                    {t("common.enterValidNumber")}
                </small>
            )}
        </div>
    );
};

type CheckboxFieldProps = {
    label: string;
    valueKey: string;
    formData: Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData: React.Dispatch<React.SetStateAction<any>>;
};

export const CheckboxField = ({
    label,
    valueKey,
    formData,
    setFormData,
}: CheckboxFieldProps) => {
    const checked = formData[valueKey] === true;
    return (
        <div className="mb-3 flex items-center gap-2">
            <Checkbox
                inputId={valueKey}
                checked={checked}
                onChange={(e) =>
                    setFormData({ ...formData, [valueKey]: e.checked ?? false })
                }
            />
            <label htmlFor={valueKey} className="block text-black">
                {label}
            </label>
        </div>
    );
};
type RadioGroupFieldProps = {
    label: string;
    valueKey: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: { label: string; value: any }[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    required?: boolean;
};

export const RadioGroupField = ({
    label,
    valueKey,
    options,
    formData,
    setFormData,
    required = false,
}: RadioGroupFieldProps) => {
    const selectedValue = formData[valueKey];

    return (
        <div className="mb-4">
            <label className="block mb-1 text-black">
                {label} {required && <span>*</span>}
            </label>
            <div className="flex gap-4">
                {options.map((option) => (
                    <div key={option.value} className="flex items-center">
                        <RadioButton
                            inputId={`${valueKey}-${option.value}`}
                            name={valueKey}
                            value={option.value}
                            onChange={(e) =>
                                setFormData({ ...formData, [valueKey]: e.value })
                            }
                            checked={selectedValue === option.value}
                        />
                        <label
                            htmlFor={`${valueKey}-${option.value}`}
                            className="ml-2 cursor-pointer"
                        >
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

type RichTextFieldProps = {
    label: string;
    valueKey: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    required?: boolean;
    maxLength?: number;
    showError?: boolean;
};

export const RichTextField = ({
    label,
    valueKey,
    formData,
    setFormData,
    required = false,
    maxLength,
    showError = false,
}: RichTextFieldProps) => {
    const { t } = useTranslation();
    const value =
        typeof formData[valueKey] === "string" ? formData[valueKey] : "";

    const getTextLength = (html: string): number => {
        if (!html) return 0;
        const textContent = html.replace(/<[^>]*>/g, "");
        return textContent.length;
    };

    const textLength = getTextLength(value);
    const isExceedingLimit = maxLength && textLength > maxLength;

    const toolbarWithoutImage = (
        <span className="ql-formats">
            <button type="button" className="ql-bold" />
            <button type="button" className="ql-italic" />
            <button type="button" className="ql-underline" />
            <button type="button" className="ql-list" value="ordered" />
            <button type="button" className="ql-list" value="bullet" />
            {/* No image button included */}
        </span>
    );

    const handleTextChange = (e: any) => {
        const newHtmlValue = e.htmlValue || "";
        setFormData({ ...formData, [valueKey]: newHtmlValue });
    };

    return (
        <div className="mb-4">
            <label className="block mb-1 text-black">
                {label} {required && <span>*</span>}
            </label>
            <Editor
                className="p-editor-container"
                value={value}
                onTextChange={handleTextChange}
                headerTemplate={toolbarWithoutImage}
                style={{ height: "150px" }}
            />
            {showError && required && !value && (
                <small className="text-red-500 text-xs">
                    {t("common.fieldRequired")}
                </small>
            )}
            {maxLength && (
                <div className={`text-xs mt-1 ${isExceedingLimit ? "text-red-500" : "text-gray-400"}`}>
                    {textLength} / {maxLength} characters
                </div>
            )}
            {isExceedingLimit && (
                <small className="text-red-500 text-xs block mt-1">
                    Maximum {maxLength} characters allowed.
                </small>
            )}
        </div>
    );
};
