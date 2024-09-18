import {
  ICalendar,
  ICalendarEvent,
} from "../../services/redux/calendars/calendars.types.ts";
import { useAppSelector } from "../../services/redux/typeHooks.ts";
import Calendar from "./Calendar.tsx";

interface Props {
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
}

const Calendars = ({
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
}: Props) => {
  const calendars = useAppSelector((state) => state.calendarsReducer.calendars);
  const isLoading = useAppSelector((state) => state.calendarsReducer.isLoading);

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div>
      {calendars &&
        calendars.map((calendar: ICalendar) => (
          <Calendar
            calendar={calendar}
            key={calendar.id}
            weeksBetweenDates={weeksBetweenDates}
            activeIndex={activeIndex}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            today={today}
            isDragging={isDragging}
            startMonth={startMonth}
            endMonth={endMonth}
            leftDay={leftDay}
            rightDay={rightDay}
            onEventEnter={onEventEnter}
            onEventLeave={onEventLeave}
          />
        ))}
    </div>
  );
};

export default Calendars;
