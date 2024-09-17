
interface ConferenceProperties {
  allowedConferenceSolutionTypes: string[];
}

export interface CalendarListEntry {
  accessRole: string;
  backgroundColor: string;
  colorId: string;
  conferenceProperties: ConferenceProperties;
  defaultReminders: any[];
  description?: string;
  etag: string;
  foregroundColor: string;
  id: string;
  kind: string;
  selected: boolean;
  summary: string;
  timeZone?: string;
}

export interface CalendarList {
  etag: string;
  items: CalendarListEntry[];
  kind: string;
  nextSyncToken: string;
}

// interface CalendarColor {
//   background: string;
//   foreground: string;
// }
//
// interface EventColor {
//   background: string;
//   foreground: string;
// }

// interface ColorsResponse {
//   calendar: Record<number, CalendarColor>;
//   event: Record<number, EventColor>;
//   kind: string;
//   updated: string;
// }

export interface CalendarListResponse extends CalendarList {
  isLoading: boolean;
}

