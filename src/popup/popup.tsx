import React, { useState, useEffect } from 'react';
import '../assets/tailwind.css';
import { createRoot } from 'react-dom/client';

interface SalahTime {
  name: string;
  time: string;
}

const Popup = () => {
  const [city, setCity] = useState('');
  const [newCity, setNewCity] = useState('');
  const [salahTimes, setSalahTimes] = useState<SalahTime[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState<boolean>(false);

  useEffect(() => {
    chrome.storage.local.get(['city'], (result) => {
      if (result.city) {
        setCity(result.city);
        fetchSalahTimes(result.city);
      }
    });
  }, []);

  const fetchSalahTimes = (cityName?: string) => {
    const cityToFetch = cityName || city;
    if (cityToFetch.trim() === '') {
      setError('Please enter a city name.');
      return;
    }

    chrome.storage.local.set({ city: cityToFetch });

    chrome.runtime.sendMessage({ action: 'fetchSalahTimes', city: cityToFetch }, (response) => {
      if (response.success) {
        const timings = response.timings;
        const salahTimesArray = [
          { name: 'Fajr', time: timings['Fajr'] },
          { name: 'Dhuhr', time: timings['Dhuhr'] },
          { name: 'Asr', time: timings['Asr'] },
          { name: 'Maghrib', time: timings['Maghrib'] },
          { name: 'Isha', time: timings['Isha'] },
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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      fetchSalahTimes();
    }
  };

  const handleNewCityKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      updateCity();
    }
  };

  const updateCity = () => {
    if (newCity.trim() !== '') {
      setCity(newCity);
      fetchSalahTimes(newCity);
      setNewCity('');
    } else {
      setError('Please enter a valid city name.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full w-full text-white content-lower">
      {!fetched && (
        <div className="text-center centered-container">
          <h1 className="mb-4">As salamu alaykum!</h1>
          <input
            className="input-city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter city name"
          />
        </div>
      )}
      {salahTimes.length > 0 && (
        <div className="overflow-y-auto w-full mt-2">
          <table className="w-full divide-y divide-gray-200 text-center">
            <tbody>
              {salahTimes.map((salahInfo, index) => (
                <tr
                  key={index}
                  className={`animate-fadeIn ${index % 2 === 0}`}
                  style={{ animationDelay: `${index * 0.25}s`, opacity: 0 }}
                >
                  <td className="table-cell text-brown">{salahInfo.name}</td>
                  <td className="table-cell text-brown">{salahInfo.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 centered-container">
            <input
              className="input-new-city"
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              onKeyPress={handleNewCityKeyPress}
              placeholder="Enter new city"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const container = document.createElement('div');
document.body.appendChild(container);

const root = createRoot(container);
root.render(<Popup />);