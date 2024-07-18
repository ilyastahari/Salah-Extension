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

  const fetchSalahTimes = () => {
    if (city.trim() === '') {
      setError('Enter a city name.');
      return;
    }

    chrome.runtime.sendMessage({ action: 'fetchSalahTimes', city }, (response) => {
      if (response.success) {
        const timings = response.timings;
        const salahTimesArray = [
          { name: 'Fajr', time: timings['Fajr'] || 'N/A' },
          { name: 'Dhuhr', time: timings['Dhuhr'] || 'N/A' },
          { name: 'Asr', time: timings['Asr'] || 'N/A' },
          { name: 'Maghrib', time: timings['Maghrib'] || 'N/A' },
          { name: 'Isha', time: timings['Isha'] || 'N/A' },
        ];
        setSalahTimes(salahTimesArray);
        setError(null);
      } else {
        setError(response.error);
        setSalahTimes([]);
      }
    });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen p-4">
      <div className="w-[225px] border border-gray-300 rounded-lg overflow-auto bg-white p-4">
        <h1 className="text-center text-xl font-bold mb-4">As salamu alaykum!</h1>
        <h2 className="text-center text-xl font-bold mb-4">Enter a city below:</h2>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="w-full px-2 py-1 mb-2 border border-gray-300 rounded"
        />
        <button
          onClick={fetchSalahTimes}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit
        </button>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        <table className="min-w-full divide-y divide-gray-200 text-center mt-4">
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
    </div>
  );
};

const container = document.createElement('div');
document.body.appendChild(container);

const root = createRoot(container);
root.render(<Popup />);