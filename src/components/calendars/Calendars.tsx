import { ICalendar } from "../../services/redux/calendars/calendars.types.ts";
import { useAppSelector } from "../../services/redux/typeHooks.ts";
import Calendar from "./Calendar.tsx";

const Calendars= () => {
  const calendars = useAppSelector(state => state.calendarsReducer.calendars)
  const isLoading = useAppSelector(state => state.calendarsReducer.isLoading)

  if (isLoading) {
    return <>Loading...</>
  }

  return (
    <div>
      {calendars && calendars.map((calendar: ICalendar) => (
        <Calendar calendar={calendar} key={calendar.id} />
      ))}
    </div>
  );
};

export default Calendars;