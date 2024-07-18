import React, { useState } from 'react';
import '../assets/tailwind.css';
import { createRoot } from 'react-dom/client';

interface SalahTime {
  name: string;
  time: string;
}

const Popup = () => {
  const [city, setCity] = useState('');
  const [salahTimes, setSalahTimes] = useState<SalahTime[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState<boolean>(false);

  const fetchPrayerTimes = () => {
    if (city.trim() === '') {
      setError('Please enter a city name.');
      return;
    }

    chrome.runtime.sendMessage({ action: 'fetchPrayerTimes', city }, (response) => {
      if (response.success) {
        const timings = response.timings;
        const salahTimesArray = [
          { name: 'Fajr', time: timings['Fajr']},
          { name: 'Dhuhr', time: timings['Dhuhr']},
          { name: 'Asr', time: timings['Asr']},
          { name: 'Maghrib', time: timings['Maghrib']},
          { name: 'Isha', time: timings['Isha']},
        ];
        setSalahTimes(salahTimesArray);
        setFetched(true);
        setError(null);
      } else {
        setError(response.error);
        setSalahTimes([]);
      }
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[225px] h-[200px] border border-gray-300 rounded-lg bg-white p-4 flex flex-col justify-between items-center">
        {!fetched && (
          <>
            <h1 className="text-center mb-4">As salamu alaykum!</h1>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className="w-full px-2 py-1 mb-2 border border-gray-300 rounded"
            />
            <button
              onClick={fetchPrayerTimes}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Fetch Salah Times
            </button>
            {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
          </>
        )}
        {salahTimes.length > 0 && (
          <div className="overflow-y-auto w-full mt-2">
            <table className="w-full divide-y divide-gray-200 text-center">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {salahTimes.map((salahInfo, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-2 whitespace-nowrap">{salahInfo.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{salahInfo.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const container = document.createElement('div');
document.body.appendChild(container);

const root = createRoot(container);
root.render(<Popup />);