export const calendarsService = {
  fetchCalendars: async (token: string) => {
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }
    );

    const data = await response.json();

    return data;
  },

  fetchCalendarEvents: async (token: string, calendarId: string) => {
    const encodedCalendarId = encodeURIComponent(calendarId);
    const timeMin = new Date('2024-09-01T00:00:00Z').toISOString();
    const timeMax = new Date('2024-09-30T23:59:59Z').toISOString();
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodedCalendarId}/events?timeMin=${timeMin}&timeMax=${timeMax}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }
    );

    const data = await response.json();

    return data;
  }

  // async changeCalendarVisibility(calendarId: string, selected: boolean, token: string) {
  //   const response = await fetch(`https://www.googleapis.com/calendar/v3/users/me/calendarList/${calendarId}`, {
  //     method: 'PATCH',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${token}`
  //     },
  //     body: JSON.stringify({ selected })
  //   });
  //   console.log(response);
  //
  //   if (!response.ok) {
  //     throw new Error('Error updating calendar visibility');
  //   }
  //
  //   return await response.json();
  // }
}