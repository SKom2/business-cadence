import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { calendarsService } from "./calendars.service.ts";
import { Session } from "@supabase/supabase-js";
import { ICalendar, ICalendarEvent, ICalendarListState } from "./calendars.types.ts";

export const fetchCalendarsWithEvents = createAsyncThunk(
  'auth/fetchCalendarsWithEvents',
  async (session: Session, { fulfillWithValue, rejectWithValue }) => {
    try {
      if (session.provider_token) {
        const calendarsResponse = await calendarsService.fetchCalendars(session.provider_token);
        if (!calendarsResponse) throw new Error("Failed to fetch calendars");

        const fetchEventsPromises = calendarsResponse.items.map(async (calendar: ICalendar) => {
          const eventsResponse = await calendarsService.fetchCalendarEvents(session.provider_token!, calendar.id);
          return { calendarId: calendar.id, events: eventsResponse.items };
        });

        const eventsResults = await Promise.all(fetchEventsPromises);

        return fulfillWithValue({ calendars: calendarsResponse.items, events: eventsResults });
      } else{
        rejectWithValue("Failed to fetch calendars")
      }
    } catch (error: unknown) {
      return rejectWithValue(error);
    }
  }
);

// export const changeCalendarVisibility = createAsyncThunk(
//   'auth/changeCalendarVisibility',
//   async ({ calendarId, selected, session }: { calendarId: string, selected: boolean, session: Session }, { rejectWithValue }) => {
//     try {
//       const response = await calendarsService.changeCalendarVisibility(calendarId, selected, session.provider_token!);
//       return response;
//     } catch (error: unknown) {
//       return rejectWithValue(error);
//     }
//   }
// );

const initialState: ICalendarListState = {
  calendars: [],
  isLoading: false,
};

const calendarsSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.calendars = action.payload;
    },
    toggleCalendarVisibility: (state, action) => {
      state.calendars = state.calendars.map(calendar =>
        calendar.id === action.payload
          ? { ...calendar, selected: !calendar.selected }
          : calendar
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendarsWithEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCalendarsWithEvents.fulfilled, (state, action) => {
        if (action.payload) {
          state.calendars = action.payload.calendars.map((calendar: ICalendar) => {
            const calendarEvents = action.payload!.events.find((eventItem: ICalendarEvent) => eventItem.calendarId === calendar.id);
            return {
              ...calendar,
              events: calendarEvents ? calendarEvents.events : [],
            };
          });
          state.isLoading = false;
        }
      })
      .addCase(fetchCalendarsWithEvents.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const { setItems, toggleCalendarVisibility } = calendarsSlice.actions;
export const calendarsReducer = calendarsSlice.reducer;
