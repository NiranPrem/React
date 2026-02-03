import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";

import AtsLoader from "../../shared/components/ats-loader/AtsLoader";
import { useTranslation } from "react-i18next";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Event.css";
import { AddEventDialog } from "./AddEventDialog";
import {
  addEventRequest,
  fetchEventByIntrerviewerRequest,
  fetchEventRequest,
  fetchInterviewerRequest,
  updateEventRequest,
} from "../../store/reducers/eventSlice";
import type {
  EventByInterviewerInterface,
  EventInterface,
} from "../../shared/interface/EventInterface";
import ToastService from "../../services/toastService";
import { XIcon } from "lucide-react";
import EmptyState from "../../shared/components/empty-state/EmptyState";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Event = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [selectedInterviewer, setSelectedInterviewer] = useState<number | null>(
    null
  );

  const { events, loading, success, editSuccess, interviewer } = useSelector(
    (state: RootState) => state.calendarEvents
  );

  // Map candidates to events using firstName and updatedDate
  const mappedEvents: EventInterface[] = events
    ? events.map((inter) => {
      const startDate = new Date(inter.start ?? "");
      const endDate = new Date(inter.end ?? ""); // 1 hour duration
      return {
        title: inter.title,
        start: startDate,
        end: endDate,
        startDate: inter.start,
        endDate: inter.end,
        attendees: inter.attendees,
        eventId: inter.eventId,
        createdBy: inter.createdBy,
        notes: inter.notes,
        isAvailable: inter.isAvailable,
      };
    })
    : [];

  // Initialize events with mapped candidate events
  const [event, setEvents] = useState<EventInterface[]>(mappedEvents);
  // Whenever candidates change, update events state
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [viewDate, setViewDate] = useState<Date>(new Date()); // Added viewDate state
  const [editingEvent, setEditingEvent] = useState<EventInterface | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const clickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastClickTime = useRef(0);

  useEffect(() => {
    setEvents(mappedEvents);
  }, [events]);

  useEffect(() => {
    const body = document.body;
    if (showDialog) {
      body.classList.add("hide-rbc-overlay");
    } else {
      body.classList.remove("hide-rbc-overlay");
    }
  }, [showDialog]);

  useEffect(() => {
    if (success || editSuccess) {
      setEditingEvent(null);
      setShowDialog(false);
      if (selectedInterviewer) {
        dispatch(
          fetchEventByIntrerviewerRequest({
            InterviewerId: selectedInterviewer,
          })
        );
      } else {
        handleAllEvent();
      }
      dispatch(fetchInterviewerRequest());
    }
  }, [success, editSuccess, selectedInterviewer, dispatch]);
  // Handle event selection only work for available events
  const handleSelectEvent = (event: EventInterface) => {
    setSelectedDate(event.start ? new Date(event.start) : null);
  };

  const handleAllEvent = () => {
    setSelectedInterviewer(null);
    dispatch(fetchEventRequest());
  };

  // Handle event double click to edit
  const handleDoubleClickEvent = (event: EventInterface) => {
    setEditingEvent(event);
    setSelectedDate(event.start ? new Date(event.start) : null);
    setShowDialog(true);
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    const now = Date.now();
    // Detect double click within 300ms
    if (now - lastClickTime.current < 300) {
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current);
        clickTimeout.current = null;
      }
      handleDoubleClickSlot({ start });
    } else {
      clickTimeout.current = setTimeout(() => {
        setSelectedDate(start);
        clickTimeout.current = null;
      }, 300);
    }
    lastClickTime.current = now;
  };

  const handleDoubleClickSlot = ({ start }: { start: Date }) => {
    const now = new Date();
    const selected = new Date(start);
    if (selected < new Date(now.setHours(0, 0, 0, 0))) {
      // Prevent opening dialog on past date
      ToastService.showWarn("Past dates cannot be selected.");
      return;
    }
    setSelectedDate(start);
    setEditingEvent(null); // new event
    setShowDialog(true);
  };

  // Accept EventData and convert to EventInterface
  const handleAddOrEditEvent = (event: EventInterface) => {
    if (event?.eventId) {
      // Edit existing event
      const payload = {
        eventId: event.eventId,
        title: event.title,
        start: event.start,
        end: event.end,
        attendees: event.isAvailable ? [] : event.attendees,
        notes: event.notes,
        createdBy: event.createdBy,
        isAvailable: event.isAvailable,
      };
      dispatch(updateEventRequest(payload));
    } else {
      // Add new event
      const payload = {
        title: event.title,
        start: event.start,
        end: event.end,
        attendees: event.isAvailable ? [] : event.attendees,
        notes: event.notes,
        createdBy: event.createdBy,
        isAvailable: event.isAvailable,
      };
      dispatch(addEventRequest(payload));
    }
  };

  useEffect(() => {
    handleAllEvent();
    dispatch(fetchInterviewerRequest());
  }, [dispatch]);

  const handleItemClick = (inter: EventByInterviewerInterface) => {
    if (!inter.id) return;
    setSelectedInterviewer(inter.id);
    dispatch(fetchEventByIntrerviewerRequest({ InterviewerId: inter.id }));
  };

  return (
    <div className="relative w-full h-full bg-[#F6F6F6]">
      {loading && <AtsLoader />}
      <AddEventDialog
        visible={showDialog}
        onHide={() => {
          setShowDialog(false);
          setEditingEvent(null);
        }}
        onSave={handleAddOrEditEvent}
        selectedDate={selectedDate ?? new Date()}
        eventToEdit={editingEvent}
      />
      <div className="min-w-[1024px]">
        {/* Header */}
        <div className="flex justify-between items-center px-4 pt-[8px] pb-[70px] bg-[#2D4D9A] relative z-10">
          <h1 className="text-xl text-white">
            {t("common.myCalendar")}
          </h1>
        </div>
        {/* Calendar */}
        <div
          style={{ height: "calc(100vh - 115px)", overflowY: "auto" }}
          className="z-20 -mt-[60px] border border-[#EFEFEF] rounded-[24px] bg-[#F6F6F6] relative p-4 grid grid-cols-[2fr_9fr] gap-2"
        >
          <div>
            <div className="flex items-center justify-center py-2 pr-5 bg-[#F6F6F6] font-semibold text-[#181818] gap-4">
              Interviewers
              {selectedInterviewer && (
                <button
                  type="button"
                  onClick={handleAllEvent}
                  className="flex items-center gap-1 text-red-600 cursor-pointer hover:text-red-700 transition"
                >
                  <span>Clear</span>
                  <XIcon size={16} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-2 p-2 overflow-y-auto max-h-[calc(100vh-220px)]">
              {interviewer && interviewer.length > 0
                ? interviewer.map((inter) => {
                  const isSelected = selectedInterviewer === inter.id;

                  return (
                    <button
                      type="button"
                      key={inter.id}
                      onClick={() => handleItemClick(inter)}
                      className={`flex items-center rounded-[10px] transition duration-200 ease-in-out shadow-md focus:outline-none cursor-pointer min-h-10 px-4 
                        ${isSelected
                          ? "bg-[#4278f9] text-white"
                          : "bg-white text-[#181818] hover:bg-gray-100"
                        }`}
                    >
                      <span className="truncate w-full text-left">
                        {inter.name || t("common.none")}
                      </span>
                    </button>
                  );
                })
                : !loading && (
                  <EmptyState />
                )}
            </div>
          </div>

          <Calendar
            localizer={localizer}
            events={event}
            startAccessor="start"
            endAccessor="end"
            defaultView="month"
            views={["month", "week"]}
            popup={true}
            selectable={true}
            onSelectEvent={handleSelectEvent}
            onDoubleClickEvent={handleDoubleClickEvent}
            onSelectSlot={handleSelectSlot}
            date={viewDate} // Controlled date
            onNavigate={(newDate, view, action) => {
              setViewDate(newDate);
              if (action === "TODAY") {
                setSelectedDate(newDate);
              }
            }}
            step={30}
            showMultiDayTimes
            className="w-full h-full"
            eventPropGetter={(event: EventInterface) => {
              const isAvailable = event.isAvailable;
              return {
                style: {
                  backgroundColor: isAvailable ? "#d4f7d4e6" : "#f7d8dae6",
                  borderLeft: `5px solid ${isAvailable ? "#52c41a" : "#FF4D4F"
                    }`,
                  borderTop: `1px dotted ${isAvailable ? "#52c41a" : "#FF4D4F"
                    }`,
                  borderBottom: `1px dotted ${isAvailable ? "#52c41a" : "#FF4D4F"
                    }`,
                  borderRight: `1px dotted ${isAvailable ? "#52c41a" : "#FF4D4F"
                    }`,
                  color: "#000000",
                  padding: "4px 8px",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                },
              };
            }}
            slotPropGetter={(date) => {
              const today = new Date();
              const isPast = date < today;
              return {
                className: isPast ? "rbc-past-slot" : "",
              };
            }}
            dayPropGetter={(date) => {
              const today = new Date();
              const isSelected =
                selectedDate &&
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear();

              const isPast =
                date.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0);

              return {
                className: isPast ? "rbc-past-day" : "",
                style: {
                  ...(isSelected && {
                    backgroundColor: "#bfdbfe",
                    padding: "2px !important",
                  }),
                  ...(isPast && {
                    backgroundColor: "#ffe0000f",
                    color: "#999",
                  }),
                },
              };
            }}
            formats={{
              eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                `${localizer!.format(
                  start,
                  "HH:mm",
                  culture
                )} - ${localizer!.format(end, "HH:mm", culture)}`,
              timeGutterFormat: "HH:mm",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Event;
