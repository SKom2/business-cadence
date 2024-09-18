import { ICalendar } from "../../services/redux/calendars/calendars.types.ts";
import { useAppSelector } from "../../services/redux/typeHooks.ts";
import Calendar from "./Calendar.tsx";

interface Props {
  weeksBetweenDates: { start: number; end: number }[];
}

const Calendars = ({ weeksBetweenDates }: Props) => {
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
          />
        ))}
    </div>
  );
};

export default Calendars;
