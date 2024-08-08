import { useRouter } from 'next/router';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export default function Home() {
  const router = useRouter();

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Visitors',
        data: [12, 19, 3, 5, 2, 3, 9],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Sign Ups',
        data: [2, 3, 4, 1, 2, 0, 4],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Analytics',
      },
    },
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10 bg-gray-900 text-gray-100">
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-4">Welcome to Neko Analytics</h1>
          <p className="text-lg">This website uses the Analytics of NekoNode the website.</p>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Go to Dashboard
          </button>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-4">About This App</h2>
          <p className="mb-4">
            I believe that this info should be public to my users. I want to be transparent about what data I collect and how I use it.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">Weekly Overview</h2>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </main>
  );
}
