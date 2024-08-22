

import React, { useState } from 'react';
import TransactionsTable from './component/TransactionsTable';
import Statistics from './component/Statistics';
import BarChart from './component/BarChart';
import PieChart from './component/PieChart';
import ErrorBoundary from './component/ErrorBoundary'; 

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState('01');

  return (
    <div>
      <h1>Transaction Dashboard</h1>
      <div>
        <label>Select Month: </label>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>
      <ErrorBoundary>
        <Statistics selectedMonth={selectedMonth} />
        <TransactionsTable selectedMonth={selectedMonth} />
        <BarChart selectedMonth={selectedMonth} />
        <PieChart selectedMonth={selectedMonth} />
      </ErrorBoundary>
    </div>
  );
};

export default App;

