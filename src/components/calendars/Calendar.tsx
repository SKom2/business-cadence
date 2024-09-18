import { FC } from "react";
import {
  ICalendar,
  ICalendarEvent,
} from "../../services/redux/calendars/calendars.types.ts";
import { toggleCalendarVisibility } from "../../services/redux/calendars/calendars.slice.ts";
import { useAppDispatch } from "../../services/redux/typeHooks.ts";
import { months } from "../../months.ts";

function isDayAfterEvent(date: string) {
  const eventDate = new Date(date);

  // Дата начала года
  const startOfYear = new Date(eventDate.getFullYear(), 0, 1);

  // Разница в миллисекундах между указанной датой и началом года
  // @ts-ignore
  const diffInTime = eventDate - startOfYear;

  // Переводим разницу в дни (1 день = 24 * 60 * 60 * 1000 миллисекунд)
  return Math.floor(diffInTime / (24 * 60 * 60 * 1000)) + 1;
}

function getHoursFromString(isoString: string) {
  const date = new Date(isoString);
  return date.getHours();
}

const Calendar: FC<{
  calendar: ICalendar;
  weeksBetweenDates: { start: number; end: number }[];
  activeIndex: number | null;
  onMouseEnter: (index: number) => void;
  onMouseLeave: () => void;
  today: number;
  isDragging: boolean;
  startMonth: number;
  endMonth: number;
  leftDay: number;
  rightDay: number;
  onEventEnter: (event: ICalendarEvent | undefined) => void;
  onEventLeave: () => void;
}> = ({
  calendar,
  weeksBetweenDates,
  activeIndex,
  onMouseEnter,
  onMouseLeave,
  today,
  isDragging,
  startMonth,
  endMonth,
  leftDay,
  rightDay,
  onEventEnter,
  onEventLeave,
}) => {
  const dispatch = useAppDispatch();

  const events = calendar.events.filter(
    (event) =>
      leftDay <= isDayAfterEvent(event.start.dateTime) ||
      rightDay >= isDayAfterEvent(event.end.dateTime),
  );

  const onClick = () => {
    dispatch(toggleCalendarVisibility(calendar.id));
  };

  const monthsSlice = months.slice(startMonth, endMonth + 1);

  return (
    <div
      className={`flex border-b border-[#CBCBCB] ${!calendar.selected ? "" : "h-32"}`}
    >
      <div
        className={
          "flex items-start md:w-48 w-[43px] border-r border-[#828282] p-2.5"
        }
      >
        <div className={"flex gap-2 items-center truncate"}>
          <button
            className={"rounded"}
            onClick={onClick}
            style={{ backgroundColor: `${calendar.backgroundColor}30` }}
          >
            {!calendar.selected && (
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.0705 5.19312L5.17041 6.09308L7.04811 7.96792C5.96589 8.72758 5.12795 9.78556 4.63635 11.013C4.98107 11.868 5.49458 12.6448 6.14622 13.2969C6.79785 13.949 7.57424 14.463 8.42901 14.8083C9.28377 15.1537 10.1994 15.3231 11.1211 15.3067C12.0428 15.2902 12.9518 15.0881 13.7937 14.7125L15.8888 16.8068L16.7888 15.9068L6.0705 5.19312ZM10.157 14.051L10.1461 14.0481C9.77675 13.9471 9.42662 13.7795 9.11379 13.5514C8.59283 13.1715 8.20007 12.6418 7.9879 12.033C7.77779 11.43 7.75468 10.7778 7.92135 10.1617L7.92623 10.1437C8.01678 9.82891 8.15593 9.5302 8.33865 9.25835L9.26787 10.1873L9.26414 10.195C9.10146 10.546 9.05001 10.9385 9.11682 11.3197C9.18411 11.7037 9.36814 12.0576 9.64383 12.3333C9.87851 12.5679 10.1699 12.7361 10.4882 12.8224L10.4934 12.8238C10.5162 12.8299 10.539 12.8356 10.5619 12.8408C10.5935 12.8481 10.6254 12.8545 10.6575 12.8601C11.0415 12.9274 11.4369 12.8746 11.7899 12.709L12.7214 13.6403L12.7004 13.654C12.3316 13.8926 11.9171 14.0517 11.4833 14.1212C11.0412 14.192 10.5891 14.1681 10.157 14.051Z"
                  fill="#19191C"
                  fillOpacity="0.3"
                />
                <path
                  d="M13.6532 9.24522C13.2305 8.59341 12.5832 8.11948 11.8342 7.91337C11.4056 7.79713 10.9573 7.77249 10.5185 7.84106L9.5517 6.87443C11.1329 6.53084 12.7846 6.75788 14.2144 7.51536C15.6442 8.27284 16.7598 9.51187 17.3637 11.013C17.0315 11.8422 16.5389 12.5975 15.9141 13.2358L14.1272 11.4493C14.2446 10.6813 14.0759 9.89703 13.6532 9.24522Z"
                  fill="#19191C"
                  fillOpacity="0.3"
                />
              </svg>
            )}

            {calendar.selected && (
              <svg
                className={"ml-px"}
                width="21"
                height="22"
                viewBox="0 0 21 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.7136 8.41979C11.912 8.74722 12.6181 9.98417 12.2906 11.1826C11.9632 12.381 10.7262 13.0871 9.52783 12.7596C8.32942 12.4322 7.62335 11.1952 7.95078 9.99683C8.27822 8.79842 9.51516 8.09235 10.7136 8.41979Z"
                  fill="#19191C"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.59781 6.94241C6.93485 6.03991 8.51187 5.55923 10.125 5.56252C11.7381 5.55924 13.3151 6.03992 14.6522 6.94243C15.9892 7.84493 17.0248 9.12776 17.625 10.6251C17.022 12.1204 15.9857 13.4014 14.6493 14.3035C13.3129 15.2055 11.7374 15.6875 10.125 15.6875C8.51263 15.6875 6.93707 15.2055 5.60066 14.3035C4.26425 13.4014 3.228 12.1204 2.625 10.6251C3.22521 9.12775 4.26078 7.84492 5.59781 6.94241ZM12.5784 13.4202C13.1384 12.934 13.5417 12.2925 13.7372 11.5771C13.867 11.102 13.9019 10.6061 13.84 10.1175C13.7782 9.62898 13.6207 9.1574 13.3765 8.72971C13.1324 8.30203 12.8064 7.92661 12.4172 7.62491C12.028 7.3232 11.5831 7.10112 11.1081 6.97132C10.3926 6.77585 9.63528 6.79692 8.9318 7.03188C8.22832 7.26683 7.61031 7.70511 7.15592 8.29131C6.70153 8.8775 6.43117 9.58527 6.37903 10.3251C6.32689 11.065 6.49531 11.8036 6.86299 12.4478C7.23067 13.0919 7.78111 13.6125 8.44468 13.9438C9.10825 14.2751 9.85517 14.4022 10.591 14.309C11.3268 14.2158 12.0184 13.9065 12.5784 13.4202Z"
                  fill="#19191C"
                />
              </svg>
            )}
          </button>
          <div className={`text-xs font-semibold hidden md:block`}>
            {calendar.summary}
          </div>
        </div>
      </div>

      {rightDay - leftDay === 1 && (
        <div className={"flex grow"}>
          {Array.from({ length: 24 }, (_, i) => i + 1).map((hour, index) => {
            const isEventStart = events.find(
              (event) =>
                isDayAfterEvent(event.start.dateTime) === leftDay &&
                getHoursFromString(event.start.dateTime) === hour,
            );

            const isEventEnd = events.find(
              (event) =>
                isDayAfterEvent(event.end.dateTime) === leftDay &&
                getHoursFromString(event.end.dateTime) === hour,
            );

            const isEvent = events.find(
              (event) =>
                getHoursFromString(event.start.dateTime) <= hour &&
                getHoursFromString(event.end.dateTime) >= hour &&
                isDayAfterEvent(event.start.dateTime) <= leftDay &&
                isDayAfterEvent(event.end.dateTime) >= leftDay,
            );

            return (
              <div
                key={hour}
                className={"flex grow relative"}
                onMouseEnter={() => onMouseEnter(index)}
                onMouseLeave={onMouseLeave}
              >
                {calendar.selected && (
                  <>
                    {isEventStart && !isEventEnd && (
                      <div
                        className={`absolute top-1 left-1 bottom-1 right-0 rounded-l-lg`}
                        style={{
                          backgroundColor: isEventStart.backgroundColor,
                        }}
                      >
                        <div
                          style={{
                            writingMode: "vertical-rl",
                            transform: "rotate(180deg)",
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                            paddingTop: 6,
                            height: 119,
                            zIndex: 1,
                            overflow: "hidden",
                            position: "relative",
                            color: "#fff",
                            fontSize: 12,
                          }}
                        >
                          {isEventStart.summary}
                        </div>
                      </div>
                    )}
                    {isEventEnd && !isEventStart && (
                      <div
                        className={`absolute top-1 left-0 bottom-1 right-1 rounded-r-lg`}
                        style={{ backgroundColor: isEventEnd.backgroundColor }}
                      />
                    )}
                    {isEventEnd && isEventStart && (
                      <div
                        className={`absolute top-1 left-1 bottom-1 right-1 rounded`}
                        style={{ backgroundColor: isEventEnd.backgroundColor }}
                      >
                        <div
                          style={{
                            writingMode: "vertical-rl",
                            transform: "rotate(180deg)",
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                            paddingTop: 6,
                            height: 119,
                            zIndex: 1,
                            overflow: "hidden",
                            position: "relative",
                            color: "#fff",
                            fontSize: 12,
                          }}
                        >
                          {isEventStart.summary}
                        </div>
                      </div>
                    )}
                    {!isEventEnd && !isEventStart && isEvent && (
                      <div
                        className={`absolute top-1 left-0 bottom-1 right-0`}
                        style={{ backgroundColor: isEvent.backgroundColor }}
                      />
                    )}
                  </>
                )}

                <div
                  className={`flex flex-1 items-center justify-center text-[8px] border-[#828282] border-r ${!isDragging && index === activeIndex ? "bg-[#F9EFFF]" : ""}`}
                />
              </div>
            );
          })}
          {Array.from({ length: 24 }, (_, i) => i + 1).map((hour, index) => {
            const isEventStart = events.find(
              (event) =>
                isDayAfterEvent(event.start.dateTime) === rightDay &&
                getHoursFromString(event.start.dateTime) === hour,
            );

            const isEventEnd = events.find(
              (event) =>
                isDayAfterEvent(event.end.dateTime) === rightDay &&
                getHoursFromString(event.end.dateTime) === hour,
            );

            const isEvent = events.find(
              (event) =>
                getHoursFromString(event.start.dateTime) <= hour &&
                getHoursFromString(event.end.dateTime) >= hour &&
                isDayAfterEvent(event.start.dateTime) <= rightDay &&
                isDayAfterEvent(event.end.dateTime) >= rightDay,
            );

            return (
              <div
                key={hour}
                className={"flex grow relative"}
                onMouseEnter={() => onMouseEnter(index + 24)}
                onMouseLeave={onMouseLeave}
              >
                {calendar.selected && (
                  <>
                    {isEventStart && !isEventEnd && (
                      <div
                        className={`absolute top-1 left-1 bottom-1 right-0 rounded-l-lg`}
                        style={{
                          backgroundColor: isEventStart.backgroundColor,
                        }}
                      >
                        <div
                          style={{
                            writingMode: "vertical-rl",
                            transform: "rotate(180deg)",
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                            paddingTop: 6,
                            height: 119,
                            zIndex: 1,
                            overflow: "hidden",
                            position: "relative",
                            color: "#fff",
                            fontSize: 12,
                          }}
                        >
                          {isEventStart.summary}
                        </div>
                      </div>
                    )}
                    {isEventEnd && !isEventStart && (
                      <div
                        className={`absolute top-1 left-0 bottom-1 right-1 rounded-r-lg`}
                        style={{ backgroundColor: isEventEnd.backgroundColor }}
                      />
                    )}
                    {isEventEnd && isEventStart && (
                      <div
                        className={`absolute top-1 left-1 bottom-1 right-1 rounded`}
                        style={{ backgroundColor: isEventEnd.backgroundColor }}
                      >
                        <div
                          style={{
                            writingMode: "vertical-rl",
                            transform: "rotate(180deg)",
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                            paddingTop: 6,
                            height: 119,
                            zIndex: 1,
                            overflow: "hidden",
                            position: "relative",
                            color: "#fff",
                            fontSize: 12,
                          }}
                        >
                          {isEventStart.summary}
                        </div>
                      </div>
                    )}
                    {!isEventEnd && !isEventStart && isEvent && (
                      <div
                        className={`absolute top-1 left-0 bottom-1 right-0`}
                        style={{ backgroundColor: isEvent.backgroundColor }}
                      />
                    )}
                  </>
                )}

                <div
                  className={`flex flex-1 items-center justify-center text-[8px] border-[#828282] border-r ${!isDragging && index + 24 === activeIndex ? "bg-[#F9EFFF]" : ""}`}
                />
              </div>
            );
          })}
        </div>
      )}

      {monthsSlice.length === 1 && rightDay - leftDay > 1 && (
        <div className={"flex grow"}>
          {Array.from(
            { length: rightDay + 1 - leftDay },
            (_, i) => i + leftDay,
          ).map((day, index) => {
            const isEventStart = events.find(
              (event) => isDayAfterEvent(event.start.dateTime) === day,
            );

            const isEventEnd = events.find(
              (event) => isDayAfterEvent(event.end.dateTime) === day,
            );

            const isEvent = events.find(
              (event) =>
                isDayAfterEvent(event.start.dateTime) <= day &&
                isDayAfterEvent(event.end.dateTime) >= day,
            );

            return (
              <div
                key={day}
                className={"flex grow relative"}
                onMouseEnter={() => onMouseEnter(index)}
                onMouseLeave={onMouseLeave}
                style={
                  day % 7 === 5 || day % 7 === 6
                    ? { backgroundColor: "#EBEBEB" }
                    : {}
                }
              >
                {calendar.selected && (
                  <>
                    {isEventStart && !isEventEnd && (
                      <div
                        className={`absolute top-1 left-1 bottom-1 right-0 rounded-l-lg`}
                        style={{
                          backgroundColor: isEventStart.backgroundColor,
                        }}
                      >
                        <div
                          style={{
                            writingMode: "vertical-rl",
                            transform: "rotate(180deg)",
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                            paddingTop: 6,
                            height: 119,
                            zIndex: 1,
                            overflow: "hidden",
                            position: "relative",
                            color: "#fff",
                            fontSize: 12,
                          }}
                        >
                          {isEventStart.summary}
                        </div>
                      </div>
                    )}
                    {isEventEnd && !isEventStart && (
                      <div
                        className={`absolute top-1 left-0 bottom-1 right-1 rounded-r-lg`}
                        style={{ backgroundColor: isEventEnd.backgroundColor }}
                      />
                    )}
                    {isEventEnd && isEventStart && (
                      <div
                        className={`absolute top-1 left-1 bottom-1 right-1 rounded`}
                        style={{ backgroundColor: isEventEnd.backgroundColor }}
                      >
                        <div
                          style={{
                            writingMode: "vertical-rl",
                            transform: "rotate(180deg)",
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                            paddingTop: 6,
                            height: 119,
                            zIndex: 1,
                            overflow: "hidden",
                            position: "relative",
                            color: "#fff",
                            fontSize: 12,
                          }}
                        >
                          {isEventStart.summary}
                        </div>
                      </div>
                    )}
                    {!isEventEnd && !isEventStart && isEvent && (
                      <div
                        className={`absolute top-1 left-0 bottom-1 right-0`}
                        style={{ backgroundColor: isEvent.backgroundColor }}
                      />
                    )}
                  </>
                )}

                <div
                  className={`flex flex-1 items-center justify-center text-[8px] border-[#828282] border-r ${!isDragging && index === activeIndex ? "bg-[#F9EFFF]" : ""}`}
                />
                {today === day && (
                  <div
                    className={`absolute top-[-25px] bottom-0 bg-[#765CF7] w-px z-10 pointer-events-none`}
                    style={{ left: `50%` }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {monthsSlice.length > 1 && rightDay - leftDay > 1 && (
        <div className={"flex grow"}>
          {weeksBetweenDates.map((week, index) => {
            const isEventStart = events.find(
              (event) =>
                isDayAfterEvent(event.start.dateTime) >= week.start &&
                isDayAfterEvent(event.start.dateTime) <= week.end,
            );

            const isEventEnd = events.find(
              (event) =>
                isDayAfterEvent(event.end.dateTime) >= week.start &&
                isDayAfterEvent(event.end.dateTime) <= week.end,
            );

            const isEvent = events.find(
              (event) =>
                isDayAfterEvent(event.start.dateTime) <= week.start &&
                isDayAfterEvent(event.end.dateTime) >= week.end,
            );

            return (
              <div
                key={`${week.start}${week.end}`}
                className={"flex grow relative"}
                onMouseEnter={() => onMouseEnter(index)}
                onMouseLeave={onMouseLeave}
              >
                {calendar.selected && (
                  <div
                    onMouseEnter={() =>
                      onEventEnter(isEventStart || isEventEnd || isEvent)
                    }
                    onMouseLeave={onEventLeave}
                  >
                    {isEventStart && !isEventEnd && (
                      <div
                        className={`absolute top-1 left-1 bottom-1 right-0 rounded-l-lg`}
                        style={{
                          backgroundColor: isEventStart.backgroundColor,
                        }}
                      >
                        <div
                          style={{
                            writingMode: "vertical-rl",
                            transform: "rotate(180deg)",
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                            paddingTop: 6,
                            height: 119,
                            zIndex: 1,
                            overflow: "hidden",
                            position: "relative",
                            color: "#fff",
                            fontSize: 12,
                          }}
                        >
                          {isEventStart.summary}
                        </div>
                      </div>
                    )}
                    {isEventEnd && !isEventStart && (
                      <div
                        className={`absolute top-1 left-0 bottom-1 right-1 rounded-r-lg`}
                        style={{ backgroundColor: isEventEnd.backgroundColor }}
                      />
                    )}
                    {isEventEnd && isEventStart && (
                      <div
                        className={`absolute top-1 left-1 bottom-1 right-1 rounded`}
                        style={{ backgroundColor: isEventEnd.backgroundColor }}
                      >
                        <div
                          style={{
                            writingMode: "vertical-rl",
                            transform: "rotate(180deg)",
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                            paddingTop: 6,
                            height: 119,
                            zIndex: 1,
                            overflow: "hidden",
                            position: "relative",
                            color: "#fff",
                            fontSize: 12,
                          }}
                        >
                          {isEventStart.summary}
                        </div>
                      </div>
                    )}
                    {!isEventEnd && !isEventStart && isEvent && (
                      <div
                        className={`absolute top-1 left-0 bottom-1 right-0`}
                        style={{ backgroundColor: isEvent.backgroundColor }}
                      />
                    )}
                  </div>
                )}
                <div
                  className={`flex flex-1 items-center justify-center text-[8px] border-[#828282] border-r ${!isDragging && index === activeIndex ? "bg-[#F9EFFF]" : ""}`}
                />
                {today >= week.start && today <= week.end && (
                  <div
                    className={`absolute top-[-25px] bottom-0 bg-[#765CF7] w-px z-10 pointer-events-none`}
                    style={{
                      left: `${((today - week.start) / (week.end - week.start)) * 100}%`,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Calendar;
