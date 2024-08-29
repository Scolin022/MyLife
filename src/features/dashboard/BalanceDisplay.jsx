import React from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { motion } from 'framer-motion';

function BalanceDisplay({ transactions }) {
    const currentDate = new Date();
    const startOfCurrentMonth = startOfMonth(currentDate);
    const endOfCurrentMonth = endOfMonth(currentDate);

    const totalSpending = transactions
        .filter(t => new Date(t.date) >= startOfCurrentMonth && new Date(t.date) <= endOfCurrentMonth)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return (
        <motion.div
            className="bg-white shadow-md rounded-lg p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h2
                className="text-xl font-semibold mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
            >
                Total Spending
            </motion.h2>
            <motion.p
                className="text-3xl font-bold text-red-600"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            >
                ${Math.abs(totalSpending).toFixed(2)}
            </motion.p>
            <motion.p
                className="text-sm text-gray-500 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
            >
                {format(startOfCurrentMonth, 'MMMM d')} - {format(endOfCurrentMonth, 'MMMM d, yyyy')}
            </motion.p>
        </motion.div>
    );
}

export default BalanceDisplay;