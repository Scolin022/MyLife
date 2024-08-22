import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, Edit2, Trash2 } from 'lucide-react';

function TransactionList({ transactions, onEdit, onDelete }) {
    return (
        <motion.ul
            className="bg-white shadow-md rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {transactions.map(tx => (
                <motion.li
                    key={tx.id}
                    className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <span className={`w-10 h-10 rounded-full flex items-center justify-center ${Number(tx.amount) >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                <DollarSign size={20} />
                            </span>
                            <div className="ml-3">
                                <span className="font-medium text-gray-800">{tx.category}</span>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <Calendar size={14} className="mr-1" />
                                    {tx.date}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className={`font-semibold text-lg mr-4 ${Number(tx.amount) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${Math.abs(Number(tx.amount)).toFixed(2)}
                            </span>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onEdit(tx)}
                                className="text-blue-500 hover:text-blue-700 mr-2 p-1"
                            >
                                <Edit2 size={18} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onDelete(tx.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                            >
                                <Trash2 size={18} />
                            </motion.button>
                        </div>
                    </div>
                </motion.li>
            ))}
        </motion.ul>
    )
}

export default TransactionList;