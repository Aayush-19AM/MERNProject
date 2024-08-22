
import React, { useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const PieChart = ({ data }) => {
  useEffect(() => {
    const ctx = document.getElementById('pieChart').getContext('2d');
    
    if (ctx.chart) {
      ctx.chart.destroy();
    }

    const myChart = new ChartJS(ctx, {
      type: 'pie',
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

  return <canvas id="pieChart"></canvas>;
};

export default PieChart;
