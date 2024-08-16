import React from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';

function BalanceDisplay({ transactions }) {
    const currentDate = new Date();
    const startOfCurrentMonth = startOfMonth(currentDate);
    const endOfCurrentMonth = endOfMonth(currentDate);

    const totalSpending = transactions
        .filter(t => new Date(t.date) >= startOfCurrentMonth && new Date(t.date) <= endOfCurrentMonth)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">Total Spending</h2>
            <p className="text-3xl font-bold text-red-600">${Math.abs(totalSpending).toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">
                {format(startOfCurrentMonth, 'MMMM d')} - {format(endOfCurrentMonth, 'MMMM d, yyyy')}
            </p>
        </div>
    );
}

export default BalanceDisplay;