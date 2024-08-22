
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionsTable = ({ selectedMonth }) => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/transactions', {
          params: { month: selectedMonth, search, page, perPage }
        });
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTransactions();
  }, [selectedMonth, search, page, perPage]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search transaction"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map(transaction => (
              <tr key={transaction._id}>
                <td>{transaction._id}</td>
                <td>{transaction.title}</td>
                <td>{transaction.description}</td>
                <td>{transaction.price}</td>
                <td>{transaction.category}</td>
                <td>{transaction.sold ? 'Yes' : 'No'}</td>
                <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default TransactionsTable;
