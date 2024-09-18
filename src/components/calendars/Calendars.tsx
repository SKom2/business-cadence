import { ICalendar } from "../../services/redux/calendars/calendars.types.ts";
import { useAppSelector } from "../../services/redux/typeHooks.ts";
import Calendar from "./Calendar.tsx";

interface Props {
  weeksBetweenDates: { start: number; end: number }[];
  activeIndex: number | null;
  onMouseEnter: (index: number) => void;
  onMouseLeave: () => void;
}

const Calendars = ({
  weeksBetweenDates,
  activeIndex,
  onMouseEnter,
  onMouseLeave,
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
          />
        ))}
    </div>
  );
};

export default Calendars;
