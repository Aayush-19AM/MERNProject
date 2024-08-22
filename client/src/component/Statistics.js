
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = ({ selectedMonth }) => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/statistics', {
          params: { month: selectedMonth }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };
    fetchStats();
  }, [selectedMonth]);

  return (
    <div>
      <h3>Statistics for {selectedMonth}</h3>
      <p>Total Sale: ${stats.totalSale || 0}</p>
      <p>Total Sold Items: {stats.totalSoldItems || 0}</p>
      <p>Total Not Sold Items: {stats.totalNotSoldItems || 0}</p>
    </div>
  );
};

export default Statistics;
