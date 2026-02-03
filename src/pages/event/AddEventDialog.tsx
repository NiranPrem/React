import { Dialog } from "primereact/dialog";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DropdownField,
  InputTextArea,
  InputTextField,
} from "../../shared/components/ats-inputs/Inputs";
import type {
  Attendees,
  EventInterface,
} from "../../shared/interface/EventInterface";
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventByIdRequest } from "../../store/reducers/eventSlice";
import type { RootState } from "../../store/store";
import {
  AutoComplete,
  type AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { fetchAttendeesDataRequest } from "../../store/reducers/masterDataSlice";
import { Calendar } from "primereact/calendar";
import AtsLoader from "../../shared/components/ats-loader/AtsLoader";
import ToastService from "../../services/toastService";

interface AddEventDialogProps {
  visible: boolean;
  onHide: () => void;
  onSave: (event: EventInterface) => void;
  selectedDate: Date | null;
  eventToEdit?: EventInterface | null;
}

interface FormData {
  title?: string;
  startDate?: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
  attendees?: Attendees[] | string[];
  notes?: string;
  isAvailable?: boolean;
}

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const timeString = `${String(hour).padStart(2, "0")}:${minute}`;
  return { label: timeString, value: timeString };
});

const formatTime = (date?: Date | string): string => {
  if (!date) return "00:00";
  const d = new Date(date);
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
};

const getInitialFormData = (
  selectedDate: Date | null,
  eventToEdit?: EventInterface | null
): FormData => {
  if (eventToEdit) {
    return {
      title: eventToEdit.title || "",
      startDate: eventToEdit.startDate
        ? new Date(eventToEdit.startDate)
        : selectedDate
          ? selectedDate
          : new Date(),
      endDate: eventToEdit.endDate
        ? new Date(eventToEdit.endDate)
        : selectedDate
          ? selectedDate
          : new Date(),
      startTime: formatTime(eventToEdit.startDate || eventToEdit.start),
      endTime: formatTime(eventToEdit.endDate || eventToEdit.end),
      attendees: eventToEdit.attendees || [],
      notes: eventToEdit.notes || "",
      isAvailable: eventToEdit.isAvailable || false,
    };
  }
  if (selectedDate) {
    return {
      title: "",
      startDate: new Date(selectedDate),
      endDate: new Date(selectedDate),
      startTime: "00:00",
      endTime: "00:30",
      attendees: [],
      isAvailable: false,
      notes: "",
    };
  }
  return {
    title: "",
    startDate: new Date(),
    endDate: new Date(),
    startTime: "00:00",
    endTime: "00:30",
    attendees: [],
    notes: "",
  };
};

export const AddEventDialog = ({
  visible,
  onHide,
  onSave,
  selectedDate,
  eventToEdit,
}: AddEventDialogProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { attendees, loading } = useSelector(
    (state: RootState) => state.masterData
  );
  const { selectedEvents, loading: eventLoading } = useSelector(
    (state: RootState) => state.calendarEvents
  );
  const dropdownOptions = {
    yesOrNo: [
      { label: t("common.no"), value: false },
      { label: t("common.yes"), value: true },
    ],
  };
  const yesOrNo = dropdownOptions.yesOrNo.map((type) => ({
    label: type.label,
    value: type.value,
  }));
  const [formData, setFormData] = useState<FormData>(() =>
    getInitialFormData(selectedDate, eventToEdit)
  );
  const [selectedAttendees, setSelectedAttendees] = useState<Attendees[]>([]);
  const [filteredAttendees, setFilteredAttendees] = useState<Attendees[]>([]);
  const isEditMode = useMemo(() => Boolean(eventToEdit), [eventToEdit]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dialogTitle = useMemo(
    () => (isEditMode ? "Edit Event" : "Add Event"),
    [isEditMode]
  );

  const isFormValid = useMemo(() => {
    if (formData.isAvailable) {
      return (
        formData.title &&
        formData.title.trim() &&
        formData.startDate !== null &&
        formData.endDate !== null
      );
    } else {
      return (
        formData.title &&
        formData.title.trim() &&
        formData.startDate !== null &&
        formData.endDate !== null &&
        formData.attendees &&
        formData.attendees.length > 0
      );
    }
  }, [formData]);

  const searchAttendees = useCallback(
    (event: AutoCompleteCompleteEvent) => {
      setTimeout(() => {
        const query = event.query.trim().toLowerCase();
        const filtered =
          query.length === 0
            ? [...attendees]
            : attendees.filter((attendee: Attendees) =>
              attendee.name?.toLowerCase().startsWith(query)
            );
        setFilteredAttendees(filtered);
      }, 250);
    },
    [attendees]
  );

  useEffect(() => {
    if (!visible) return;
    const newFormData = getInitialFormData(selectedDate, eventToEdit);
    setFormData(newFormData);
    if (!eventToEdit) {
      setSelectedAttendees([]);
    }
  }, [visible, selectedDate, eventToEdit]);

  useEffect(() => {
    if (!visible || !eventToEdit || attendees.length === 0) return;
    const eventAttendeeList: {
      id: number;
      isCandidate: boolean;
      name: string;
    }[] = [];
    if (Array.isArray(eventToEdit.attendees)) {
      eventToEdit.attendees.forEach((attendee) => {
        if (
          typeof attendee === "object" &&
          attendee !== null &&
          "id" in attendee &&
          "isCandidate" in attendee
        ) {
          eventAttendeeList.push({
            id: (attendee as Attendees).id as number,
            isCandidate: (attendee as Attendees).isCandidate || false,
            name: (attendee as Attendees).name || "",
          });
        }
      });
    }
    const matchingAttendees = attendees.filter((attendee: Attendees) =>
      eventAttendeeList.some(
        (ea) =>
          ea.id === attendee.code && ea.isCandidate === attendee.isCandidate
      )
    );
    setSelectedAttendees(matchingAttendees);
    setFormData((prev) => ({
      ...prev,
      attendees: matchingAttendees
        .map((attendee: Attendees) => attendee.name)
        .filter((name): name is string => typeof name === "string"),
    }));
  }, [visible, eventToEdit, attendees]);

  useEffect(() => {
    if (visible) {
      dispatch(fetchAttendeesDataRequest());

      if (selectedDate) {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const day = String(selectedDate.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;

        dispatch(fetchEventByIdRequest({ EventId: dateStr }));
      }
    }
  }, [visible, selectedDate, dispatch]);

  const validateDateTime = useCallback((): string | null => {
    const { startDate, endDate, startTime, endTime } = formData;

    if (!startDate || !endDate || !startTime || !endTime) {
      return "Please complete all required fields.";
    }
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const startDateTime = new Date(startDate);
    startDateTime.setHours(startHour, startMinute, 0, 0);
    const endDateTime = new Date(endDate);
    endDateTime.setHours(endHour, endMinute, 0, 0);
    if (endDateTime <= startDateTime) {
      return "End time must be after start time.";
    }
    return null;
  }, [formData]);

  const handleSubmit = useCallback(() => {
    const validationError = validateDateTime();
    if (validationError) {
      ToastService.showWarn(validationError);
      return;
    }
    const {
      startDate,
      endDate,
      startTime,
      endTime,
      title,
      notes,
      isAvailable,
    } = formData;
    if (!startDate || !endDate || !startTime || !endTime) {
      ToastService.showWarn("Please select start and end dates and times.");
      return;
    }

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const start = new Date(startDate);
    start.setHours(startHour, startMinute, 0, 0);
    const end = new Date(endDate);
    end.setHours(endHour, endMinute, 0, 0);
    const transformedAttendees = selectedAttendees.map((attendee) => ({
      id: attendee.code,
      isCandidate: attendee.isCandidate,
      name: attendee.name,
      isAvailable: attendee.isAvailable,
    }));
    const eventPayload: EventInterface = {
      eventId: eventToEdit?.eventId ?? 0,
      title: title?.trim(),
      start: start.toISOString(),
      end: end.toISOString(),
      notes: notes?.trim(),
      attendees: transformedAttendees,
      createdBy: eventToEdit?.createdBy ?? 0,
      isAvailable: isAvailable,
    };
    onSave(eventPayload);
  }, [formData, selectedAttendees, eventToEdit, validateDateTime, onSave]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAttendeesChange = useCallback((e: any) => {
    const newSelectedAttendees = e.value || [];
    setSelectedAttendees(newSelectedAttendees);
    setFormData((prev) => ({
      ...prev,
      attendees: newSelectedAttendees.map(
        (attendee: Attendees) => attendee.name
      ),
    }));
  }, []);

  const displayDate = useMemo(() => {
    return formData.startDate
      ? new Date(formData.startDate).toDateString()
      : "Selected Date";
  }, [formData.startDate]);

  return (
    <Dialog
      header={dialogTitle}
      visible={visible}
      onHide={onHide}
      className="w-[60rem]"
      breakpoints={{ "960px": "90vw" }}
      modal
      draggable={false}
      resizable={false}
      closeOnEscape
    >
      {(loading || eventLoading) && <AtsLoader />}

      <div className="flex gap-6">
        <div className="flex-1 flex flex-col gap-4 mt-2">
          <DropdownField
            label={"Create as available free slot?"}
            valueKey="isAvailable"
            options={yesOrNo}
            formData={formData}
            setFormData={setFormData}
            filter={false}
          />
          <InputTextField
            label="Title *"
            placeholder="title"
            valueKey="title"
            formData={formData}
            setFormData={setFormData}
            required
          />
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block mb-1 text-black">Start Date *</label>
              <Calendar
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.value as Date,
                  }))
                }
                dateFormat="yy-mm-dd"
                showIcon
                className="w-full"
                required
                minDate={today}
              />
            </div>
            <DropdownField
              label="Start Time *"
              valueKey="startTime"
              options={TIME_OPTIONS}
              formData={formData}
              setFormData={setFormData}
              required
              filter={false}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block mb-1 text-black">End Date *</label>
              <Calendar
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    endDate: e.value as Date,
                  }))
                }
                dateFormat="yy-mm-dd"
                showIcon
                className="w-full"
                required
                minDate={today}
              />
            </div>
            <DropdownField
              label="End Time *"
              valueKey="endTime"
              options={TIME_OPTIONS}
              formData={formData}
              setFormData={setFormData}
              required
              filter={false}
            />
          </div>
          {!formData.isAvailable && (
            <div className="card p-fluid">
              <label htmlFor="name" className="block text-black mb-1">
                Attendees *
              </label>
              <AutoComplete
                field="name"
                placeholder="Search Attendees"
                multiple
                value={selectedAttendees}
                suggestions={filteredAttendees}
                completeMethod={searchAttendees}
                onChange={handleAttendeesChange}
                appendTo="self"
              />
            </div>
          )}
          <InputTextArea
            label="Notes"
            valueKey="notes"
            formData={formData}
            setFormData={setFormData}
            maxLength={3000}
          />
          <div className="flex justify-end mt-4 gap-2">
            <Button
              type="button"
              label="Cancel"
              severity="secondary"
              outlined
              className="!bg-white !border !border-gray-300 !text-gray-700 !rounded-lg"
              onClick={onHide}
            />
            <Button
              onClick={handleSubmit}
              label={t("common.save")}
              className="!bg-[#007BFF]"
              disabled={!isFormValid}
            />
          </div>
        </div>

        <div className="w-60 border-l border-gray-300 pl-4 overflow-y-auto max-h-[465px]">
          <h3 className="font-semibold mb-2">Events on {displayDate}</h3>
          {!selectedEvents || selectedEvents.length === 0 ? (
            <p className="text-sm text-gray-500">No events scheduled.</p>
          ) : (
            <ul className="space-y-2">
              {selectedEvents.map((ev) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const attendeeNames: any = ev.attendees;
                // FIX: Display event times
                const eventStartTime = formatTime(ev.start || ev.startDate);
                const eventEndTime = formatTime(ev.end || ev.endDate);
                return (
                  <li
                    key={ev.eventId ?? `${ev.title}-${ev.start}`}
                    className={`border-l-4 p-2 rounded border-t-1 border-b-1 border-r-1 border-r-dotted border-t-dotted border-b-dotted shadow-md ${ev.isAvailable
                        ? "border-[#52c41a] bg-[#d4f7d4e6]"
                        : "border-[#FF4D4F] bg-[#f7d8dae6]"
                      }`}
                    style={{
                      borderLeft: `5px solid ${ev.isAvailable ? "#52c41a" : "#FF4D4F"
                        }`,
                      borderTop: `1px dotted ${ev.isAvailable ? "#52c41a" : "#FF4D4F"
                        }`,
                      borderBottom: `1px dotted ${ev.isAvailable ? "#52c41a" : "#FF4D4F"
                        }`,
                      borderRight: `1px dotted ${ev.isAvailable ? "#52c41a" : "#FF4D4F"
                        }`,
                      borderRadius: "0.5rem",
                      padding: "0.5rem",
                    }}
                  >
                    <div className="font-semibold">{ev.title}</div>
                    <div className="text-xs text-gray-600">
                      {`${eventStartTime} - ${eventEndTime}`}
                    </div>
                    {attendeeNames && attendeeNames.length > 0 && (
                      <div className="text-xs text-gray-500">
                        Attendees:{" "}
                        {attendeeNames
                          ?.map((a: Attendees) => a.name)
                          .join(", ")}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Dialog>
  );
};
