
import React, { useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data }) => {
  useEffect(() => {
    const ctx = document.getElementById('barChart').getContext('2d');
    
    if (ctx.chart) {
      ctx.chart.destroy();
    }

    const myChart = new ChartJS(ctx, {
      type: 'bar',
      data: data,
      options: {}
    });

    ctx.chart = myChart;

    return () => {
      if (ctx.chart) {
        ctx.chart.destroy();
      }
    };
  }, [data]);

  return <canvas id="barChart"></canvas>;
};

export default BarChart;
