import React, { useState, useEffect } from 'react';
import BarChart from './BarChart';
// import { fetchData } from './services/dataService'; // Hypothetical external service for data fetching

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8000/events');
    setLoading(true);

    eventSource.onopen = () => {
      console.log("Connection opened.");
      setError('');
    };

    eventSource.onmessage = event => {
      console.log("New data received:", event.data);
      setData(prevData => [...prevData, JSON.parse(event.data)]);
      setLoading(false);
    };

    eventSource.onerror = event => {
      console.error("Error:", event);
      setError('Failed to connect. Please refresh or try again later.');
      setLoading(false);
      eventSource.close();
    };

    // Clean up the event source on component unmount
    return () => {
      eventSource.close();
    };
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>SSE Data Display</h1>
      {data.length ? <BarChart data={data} /> : <p>No data to display.</p>}
    </div>
  );
}

export default App;
