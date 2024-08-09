import { useCallback, useEffect, useState } from 'react';
import ChartCard from '@/components/ChartCard';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import Link from 'next/link';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [viewData, setViewData] = useState({ labels: [], datasets: [] });
  const [locationData, setLocationData] = useState({ labels: [], datasets: [] });
  const [typeData, setTypeData] = useState({ labels: [], datasets: [] });
  const [durationData, setDurationData] = useState({ labels: [], datasets: [] });
  const [range, setRange] = useState('7d'); // Default to 7 days

  const processViewData = (events) => {
    const views = events.reduce((acc, event) => {
      if (event.type === 'page_view') {
        const date = new Date(event.timestamp).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {});

    const labels = Object.keys(views).sort();
    const data = labels.map((label) => views[label]);

    return {
      labels,
      datasets: [
        {
          label: 'Number of Views',
          data,
          backgroundColor: '#3498db',
          borderColor: '#2980b9',
          borderWidth: 1,
        },
      ],
    };
  };

  const processLocationData = (events) => {
    const locations = events.reduce((acc, event) => {
      const location = event.location || 'Unknown';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(locations);
    const data = labels.map((label) => locations[label]);

    return {
      labels,
      datasets: [
        {
          label: 'Events by Location',
          data,
          backgroundColor: '#9b59b6',
          borderColor: '#8e44ad',
          borderWidth: 1,
        },
      ],
    };
  };

  const processTypeData = useCallback((events) => {
    const types = events.reduce((acc, event) => {
      const type = event.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(types);
    const data = labels.map((label) => types[label]);

    return {
      labels,
      datasets: [
        {
          label: 'Events by Type',
          data,
          backgroundColor: labels.map(() => getRandomColor()),
          borderColor: labels.map(() => getRandomColor()),
          borderWidth: 1,
        },
      ],
    };
  }, []);

  const processDurationData = (events) => {
    const durations = events.reduce((acc, event) => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + (event.duration || 0);
      return acc;
    }, {});

    const labels = Object.keys(durations).sort();
    const data = labels.map((label) => durations[label]);

    return {
      labels,
      datasets: [
        {
          label: 'Total Duration (seconds)',
          data,
          backgroundColor: '#f39c12',
          borderColor: '#e67e22',
          borderWidth: 1,
        },
      ],
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://nekonode-nekostats-api.sziwyz.easypanel.host/api/events/${range ? `?range=${range}` : ''}`);
        const processedViewData = processViewData(response.data);
        const processedLocationData = processLocationData(response.data);
        const processedTypeData = processTypeData(response.data);
        const processedDurationData = processDurationData(response.data);

        setViewData(processedViewData);
        setLocationData(processedLocationData);
        setTypeData(processedTypeData);
        setDurationData(processedDurationData);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, [range, processTypeData]);

  const handleRangeChange = (event) => {
    setRange(event.target.value);
  };

  const getRandomColor = () => {
    const colors = [
      '#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD', '#1ABC9C', '#E74C3C', '#2ECC71', '#3498DB'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const viewChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Number of Site Views per Day' },
    },
    scales: {
      x: {
        grid: { display: false },
        title: { display: true, text: 'Date' },
      },
      y: {
        title: { display: true, text: 'Number of Views' },
      },
    },
  };

  const locationChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Events by Location' },
    },
    scales: {
      x: {
        grid: { display: false },
        title: { display: true, text: 'Location' },
      },
      y: {
        title: { display: true, text: 'Count' },
      },
    },
  };

  const typeChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Events by Type' },
    },
    scales: {
      x: {
        grid: { display: false },
        title: { display: true, text: 'Event Type' },
      },
      y: {
        title: { display: true, text: 'Count' },
      },
    },
  };

  const durationChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Total Duration per Day' },
    },
    scales: {
      x: {
        grid: { display: false },
        title: { display: true, text: 'Date' },
      },
      y: {
        title: { display: true, text: 'Duration (seconds)' },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4">Analytics Dashboard</h1>
          <p className="text-lg text-gray-300">Track and analyze your website&apos;s performance with NekoNode Analytics.</p>
        </div>

        <div className="flex justify-center mb-12">
          <Link href="/" className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition">
            Go to Home
          </Link>
        </div>

        <div className="mb-12 text-center">
          <label htmlFor="range" className="mr-4 text-lg font-semibold">Select Date Range:</label>
          <select
            id="range"
            value={range}
            onChange={handleRangeChange}
            className="bg-gray-700 text-white p-2 rounded-lg">
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="">All Time</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <ChartCard title="Site Views" data={viewData} options={viewChartOptions} />
          <ChartCard title="Events by Location" data={locationData} options={locationChartOptions} />
          <ChartCard title="Events by Type" data={typeData} options={typeChartOptions} type="bar" />
          <ChartCard title="Total Duration" data={durationData} options={durationChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
