chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchSalahTimes') {
    const city = message.city;
    const country = 'US';
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const url = `http://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${city}&country=${country}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const timings = data.data[parseInt(day) - 1].timings;
        sendResponse({ success: true, timings });
      })
      .catch(error => {
        console.error('Error fetching salah times:', error);
        sendResponse({ success: false, error: 'Failed to fetch salah times.' });
      });

    return true;
  }
});
