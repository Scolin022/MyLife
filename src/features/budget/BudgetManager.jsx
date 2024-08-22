import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, DollarSign, AlertCircle } from 'lucide-react';

function BudgetManager({ categories, budgets, onSetBudget, getCategorySpending }) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedCategory && budgetAmount) {
            onSetBudget(selectedCategory, Number(budgetAmount));
            setBudgetAmount('');
            setSelectedCategory('');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    };

    const getProgressBarColor = (percentage) => {
        if (percentage <= 50) return ['#34D399', '#10B981']; // Green gradient
        if (percentage <= 80) return ['#FBBF24', '#F59E0B']; // Yellow gradient
        return ['#F87171', '#EF4444']; // Red gradient
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-lg rounded-lg p-6 mb-4"
        >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Sparkles className="mr-2"/> Manage Budgets
            </h2>
            <form onSubmit={handleSubmit} className="mb-6">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full mb-3 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <div className="relative mb-3">
                    <DollarSign className="absolute top-3 left-3 text-gray-400"/>
                    <input
                        type="number"
                        value={budgetAmount}
                        onChange={(e) => setBudgetAmount(e.target.value)}
                        placeholder="Budget amount"
                        className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>
                <motion.button
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    type="submit"
                    className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition"
                >
                    Set Budget
                </motion.button>
            </form>
            <AnimatePresence>
                {showAlert && (
                    <motion.div
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -20}}
                        transition={{duration: 0.3}}
                        className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-r-lg"
                        role="alert"
                    >
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2"/>
                            <div>
                                <p className="font-bold">Success</p>
                                <p>Budget has been updated successfully.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div>
                <h3 className="font-semibold text-xl mb-4">Current Budgets:</h3>
                {categories.map(category => {
                    const budget = budgets[category] || 0;
                    const spending = getCategorySpending(category);
                    const percentage = budget ? (spending / budget) * 100 : 0;
                    const [colorStart, colorEnd] = getProgressBarColor(percentage);

                    return (
                        <motion.div
                            key={category}
                            className="mb-4 p-4 bg-gray-50 rounded-lg"
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.3}}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">{category}</span>
                                <span className="text-sm">${spending.toFixed(2)} / ${budget.toFixed(2)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <motion.div
                                    className="h-3 rounded-full"
                                    style={{
                                        background: `linear-gradient(to right, ${colorStart}, ${colorEnd})`,
                                        width: '0%',
                                    }}
                                    animate={{width: `${Math.min(percentage, 100)}%`}}
                                    transition={{duration: 0.5, ease: "easeOut"}}
                                ></motion.div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default BudgetManager;