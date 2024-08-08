import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import axios from 'axios';
import Link from 'next/link';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [locationData, setLocationData] = useState({ labels: [], datasets: [] });
  const [typeData, setTypeData] = useState({ labels: [], datasets: [] });
  const [durationData, setDurationData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/events?range=7d');
        const processedData = processEventsData(response.data);
        const processedLocationData = processLocationData(response.data);
        const processedTypeData = processTypeData(response.data);
        const processedDurationData = processDurationData(response.data);

        setChartData(processedData);
        setLocationData(processedLocationData);
        setTypeData(processedTypeData);
        setDurationData(processedDurationData);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  const processEventsData = (events) => {
    const views = {};
    const durations = {};

    events.forEach(event => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      if (!views[date]) {
        views[date] = 0;
        durations[date] = 0;
      }
      views[date] += 1;
      durations[date] += event.duration || 0;
    });

    const labels = Object.keys(views).sort();
    const viewsData = labels.map(label => views[label]);
    const averageDurations = labels.map(label => durations[label] / views[label]);

    return {
      labels,
      datasets: [
        {
          label: 'Number of Views',
          data: viewsData,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Average Duration (seconds)',
          data: averageDurations,
          type: 'line',
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
      ],
    };
  };

  const processLocationData = (events) => {
    const locations = {};

    events.forEach(event => {
      const location = event.location || 'Unknown';
      if (!locations[location]) {
        locations[location] = 0;
      }
      locations[location] += 1;
    });

    const labels = Object.keys(locations);
    const data = labels.map(label => locations[label]);

    return {
      labels,
      datasets: [
        {
          label: 'Events by Location',
          data,
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const processTypeData = (events) => {
    const types = {};

    events.forEach(event => {
      const type = event.type;
      if (!types[type]) {
        types[type] = 0;
      }
      types[type] += 1;
    });

    const labels = Object.keys(types);
    const data = labels.map(label => types[label]);

    return {
      labels,
      datasets: [
        {
          label: 'Events by Type',
          data,
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const processDurationData = (events) => {
    const durations = {};

    events.forEach(event => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      if (!durations[date]) {
        durations[date] = 0;
      }
      durations[date] += event.duration || 0;
    });

    const labels = Object.keys(durations).sort();
    const data = labels.map(label => durations[label]);

    return {
      labels,
      datasets: [
        {
          label: 'Total Duration (seconds)',
          data,
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Number of Views and Average Duration per Day',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Count / Duration (seconds)',
        },
      },
    },
  };

  const locationChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Events by Location',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Location',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Count',
        },
      },
    },
  };

  const typeChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Events by Type',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Event Type',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Count',
        },
      },
    },
  };

  const durationChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Total Duration per Day',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Duration (seconds)',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-10">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
        </div>
        <div className="text-center mb-8">
          <p className="text-lg">This website uses the Analytics of NekoNode the website.</p>
          <Link href="/" className="text-blue-500 hover:underline">
            <br />
            <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition">
              Go to Dashboard
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Weekly Overview</h2>
            <Bar data={chartData} options={chartOptions} />
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Events by Location</h2>
            <Bar data={locationData} options={locationChartOptions} />
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Events by Type</h2>
            <Bar data={typeData} options={typeChartOptions} />
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Total Duration per Day</h2>
            <Bar data={durationData} options={durationChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
