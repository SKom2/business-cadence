import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { calendarsService } from "./calendars.service.ts";
import { Session } from "@supabase/supabase-js";
import { CalendarListResponse } from "./calendars.types.ts";

export const fetchCalendars = createAsyncThunk(
  'auth/fetchCalendars',
  async (session: Session, { fulfillWithValue, rejectWithValue }) => {
    try {
      let response;
      if (session.provider_token){
        response = await calendarsService.fetchCalendars(session.provider_token);
      }

      if (!response) throw new Error("")

      return fulfillWithValue(response);
    } catch (error: unknown) {
      return rejectWithValue(error);
    }
  }
)

export const changeCalendarVisibility = createAsyncThunk(
  'auth/changeCalendarVisibility',
  async ({ calendarId, selected, session }: { calendarId: string, selected: boolean, session: Session }, { rejectWithValue }) => {
    try {
      const response = await calendarsService.changeCalendarVisibility(calendarId, selected, session.provider_token!);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(error);
    }
  }
);

const initialState: CalendarListResponse = {
  etag: '',
  items: [],
  kind: '',
  nextSyncToken: '',
  isLoading: false,
};

const calendarsSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    toggleCalendarVisibility: (state, action) => {
      state.items = state.items.map(calendar =>
        calendar.id === action.payload
          ? { ...calendar, selected: !calendar.selected }
          : calendar
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendars.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchCalendars.fulfilled, (state, action) => {
        state.etag = action.payload.etag;
        state.items = action.payload.items;
        state.kind = action.payload.kind;
        state.nextSyncToken = action.payload.nextSyncToken;
        state.isLoading = false;
      })
      .addCase(fetchCalendars.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(changeCalendarVisibility.fulfilled, (state, action) => {
        const updatedCalendar = action.payload;
        state.items = state.items.map(calendar =>
          calendar.id === updatedCalendar.id ? updatedCalendar : calendar
        );
      });
  }
});

export const { setItems, toggleCalendarVisibility } = calendarsSlice.actions;
export const calendarsReducer = calendarsSlice.reducer;
