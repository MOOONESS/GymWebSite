import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animations: {
    tension: {
      duration: 1000,
      easing: 'linear',
      from: 1,
      to: 0,
      loop: true
    }
  },
  scales: {
    x: {
      type: 'category',
    },
    y: {
      beginAtZero: true,
      min: 0,
      max: 100, // Assuming gas percentage is in the range of 0-100
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y + '%';
          }
          return label;
        }
      }
    },
    legend: {
      display: true,
    }
  }
};

const BarChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.time),
    datasets: [
      {
        label: 'Gas Percentage',
        data: data.map(item => item.percentage),
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ height: '400px', width: '600px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default React.memo(BarChart);
