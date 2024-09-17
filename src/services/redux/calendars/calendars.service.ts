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

  async changeCalendarVisibility(calendarId: string, selected: boolean, token: string) {
    const response = await fetch(`https://www.googleapis.com/calendar/v3/users/me/calendarList/${calendarId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ selected })
    });
    console.log(response);

    if (!response.ok) {
      throw new Error('Error updating calendar visibility');
    }

    return await response.json(); // Возвращаем обновленный календарь
  }
}