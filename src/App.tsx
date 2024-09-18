import { useEffect } from "react";
import "./App.css";
import { DatePicker } from "./components/datePicker/datePicker.tsx";
import GButton from "./components/googleButton/googleButton.tsx";
import { useSession, useSessionContext } from "@supabase/auth-helpers-react";
import { useAppDispatch } from "./services/redux/typeHooks.ts";
import { setSession } from "./services/redux/auth/auth.slice.ts";
import {
  fetchCalendarsWithEvents,
  setItems
} from "./services/redux/calendars/calendars.slice.ts";
import Calendars from "./components/calendars/Calendars.tsx";
import { testCalendarData } from "./testData.ts";

function App() {
  const session = useSession();
  const { isLoading } = useSessionContext();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (session) {
      const fetchGoogleCalendarEvents = async () => {
        try {
          dispatch(setSession(session));
          if (session) {
            dispatch(fetchCalendarsWithEvents(session))
          }
        } catch (error) {
          console.error('Error fetching Google Calendar events:', error);
        }
      };


      fetchGoogleCalendarEvents();
    } else {
      dispatch(setItems(testCalendarData.calendars));
    }

  }, [session, dispatch]);

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div>
      <div className={"flex"}>
        <div
          className={
            "w-48 border-r border-b border-r-[#828282] border-b-[#D2C9DE] flex justify-center items-center"
          }
        >
          <GButton />
        </div>

        <DatePicker />
      </div>

      <Calendars />
    </div>
  );
}

export default App;
