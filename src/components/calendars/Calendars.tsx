import { CalendarListEntry } from "../../services/redux/calendars/calendars.types.ts";
import { useAppSelector } from "../../services/redux/typeHooks.ts";
import Calendar from "./Calendar.tsx";

const Calendars= () => {
  const items = useAppSelector(state => state.calendarsReducer.items)

  return (
    <div>
      {items && items.map((calendar: CalendarListEntry) => (
        <Calendar calendar={calendar} key={calendar.id} />
      ))}
    </div>
  );
};

export default Calendars;