import { CalendarList } from "./services/redux/calendars/calendars.types.ts";

export const testData = [
  {
    id: "1",
    name: "All events",
    hideable: false,
    hidden: false,
    items: [{ id: "1-1", name: "Serbia" }],
  },
  {
    id: "2",
    name: "YouTrack Team",
    hideable: true,
    hidden: false,
    color: "#FFE4E6",
    items: [
      { id: "2-1", name: "Gathering" },
      { id: "2-2", name: "Apps Release" },
      { id: "2-3", name: "Gathering" },
      { id: "2-4", name: "Apps Release" },
    ],
  },
  {
    id: "3",
    name: "Personal",
    hideable: true,
    hidden: false,
    color: "#FEF3C7",
    items: [
      { id: "3-1", name: "Monthly Report" },
      { id: "3-2", name: "Job interviews" },
      { id: "3-3", name: "Workshop for Innovation Jam" },
      { id: "3-4", name: "Monthly Report" },
      { id: "3-5", name: "Monthly Report" },
      { id: "3-6", name: "Workshop for Innovation Jam" },
      { id: "3-7", name: "Monthly Report" },
      { id: "3-8", name: "Service quality analysis" },
      { id: "3-9", name: "Monthly Report" },
      { id: "3-10", name: "Monthly Report" },
      { id: "3-11", name: "Monthly Report" },
      { id: "3-12", name: "Monthly Report" },
    ],
  },
  {
    id: "4",
    name: "JetBrains IDEs Release",
    hideable: true,
    hidden: false,
    color: "#E6F6FC",
    items: [
      { id: "4-1", name: "Release 2024.4" },
      { id: "4-2", name: "Influencer co-lab" },
      { id: "4-3", name: "Release 2024.5" },
      { id: "4-4", name: "Crazy September Campaign" },
    ],
  },
  // {
  //   id: "5",
  //   name: "Public Holidays",
  //   hideable: true,
  //   hidden: false,
  //   color: "#F3EEFE",
  //   items: [
  //     { id: "5-1", name: "Martin Luther King Jr. Day" },
  //     { id: "5-2", name: "Easter holiday" },
  //     { id: "5-3", name: "Summer holiday" },
  //     { id: "5-4", name: "Summer holiday" },
  //   ],
  // },
  {
    id: "6",
    name: "Vacations",
    hideable: true,
    hidden: false,
    color: "#EBF5E1",
    items: [
      { id: "6-1", name: "Serbia" },
      { id: "6-2", name: "Malta" },
      { id: "6-3", name: "USA" },
      { id: "6-4", name: "France" },
      { id: "6-5", name: "London" },
      { id: "6-6", name: "London" },
    ],
  },
  {
    id: "7",
    name: "Preply",
    hideable: true,
    hidden: true,
    color: "#E1F5F0",
    items: [],
  },
  {
    id: "8",
    name: "Gatherings",
    hideable: true,
    hidden: true,
    color: "#FFE4CB",
    items: [],
  },
  {
    id: "9",
    name: "Family",
    hideable: true,
    hidden: true,
    color: "#EBD3FF",
    items: [],
  },
];


export const testCalendarData: CalendarList = {
  etag: '"p32sf3u7tj758g0o"',
  items: [
    {
      kind: 'calendar#calendarListEntry',
      etag: '"1726583372784000"',
      id: 'en.cy#holiday@group.v.calendar.google.com',
      summary: 'Holidays in Cyprus',
      description: 'Holidays and Observances in Cyprus',
      backgroundColor: '#16a765',
      foregroundColor: '#000000',
      colorId: '8',
      selected: true,
      timeZone: 'Asia/Nicosia',
      accessRole: 'reader',
      conferenceProperties: {
        allowedConferenceSolutionTypes: ['video']
      },
      defaultReminders: [],
    },
    {
      kind: 'calendar#calendarListEntry',
      etag: '"1726583493599000"',
      id: 'aleksandr.komolkin@jetbrains.com',
      summary: 'aleksandr.komolkin@jetbrains.com',
      description: '',
      backgroundColor: '#f1c40f',
      foregroundColor: '#1d1d1d',
      colorId: '5',
      selected: false,
      timeZone: 'Asia/Nicosia',
      accessRole: 'owner',
      conferenceProperties: {
        allowedConferenceSolutionTypes: []
      },
      defaultReminders: [],
    },
    {
      kind: 'calendar#calendarListEntry',
      etag: '"1726583638056000"',
      id: 'addressbook#contacts@group.v.calendar.google.com',
      summary: 'Birthdays',
      description: 'Displays birthdays, anniversaries, and other event dates of people in Google Contacts.',
      backgroundColor: '#3498db',
      foregroundColor: '#ffffff',
      colorId: '11',
      selected: true,
      timeZone: 'Asia/Nicosia',
      accessRole: 'reader',
      conferenceProperties: {
        allowedConferenceSolutionTypes: []
      },
      defaultReminders: [],
    }
  ],
  kind: 'calendar#calendarList',
  nextSyncToken: 'CLjx-P2ZyogDEiBhbGVrc2FuZHIua29tb2xraW5AamV0YnJhaW5zLmNvbQ=='
};