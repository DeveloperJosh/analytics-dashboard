import React from 'react';
import { Bar, Line } from 'react-chartjs-2';

const ChartCard = ({ title, data, options, type = 'bar' }) => {
  const ChartComponent = type === 'line' ? Line : Bar;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <ChartComponent data={data} options={options} />
    </div>
  );
};

export default ChartCard;
