interface IConferenceProperties {
  allowedConferenceSolutionTypes: string[];
}

interface IDefaultReminders {
  method: string;
  minutes: number;
}

export interface ICalendarEvent {
  calendarId: string;
  created: string;
  creator: {
    email: string;
    displayName: string;
    self: boolean;
  };
  description?: string;
  end: {
    dateTime: string;
    timeZone: string;
  };
  etag: string;
  eventType: string;
  htmlLink: string;
  iCalUID: string;
  id: string;
  kind: string;
  organizer: {
    email: string;
    displayName: string;
    self: boolean;
  };
  sequence: number;
  start: {
    dateTime: string;
    timeZone: string;
  };
  status: string;
  summary: string;
  longSummary: string;
  backgroundColor: string;
  transparency: string;
  updated: string;
  visibility: string;
}

export interface ICalendar {
  accessRole: string;
  backgroundColor: string;
  colorId: string;
  conferenceProperties: IConferenceProperties;
  defaultReminders: IDefaultReminders[];
  description?: string;
  etag: string;
  foregroundColor: string;
  id: string;
  kind: string;
  selected: boolean;
  summary: string;
  timeZone?: string;
  events: ICalendarEvent[];
}

export interface ICalendarList {
  calendars: ICalendar[];
}

export interface ICalendarListState extends ICalendarList {
  isLoading: boolean;
}
