import React, { useState } from 'react';

function BudgetManager({ categories, budgets, onSetBudget, getCategorySpending }) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedCategory && budgetAmount) {
            onSetBudget(selectedCategory, Number(budgetAmount));
            setBudgetAmount('');
            setSelectedCategory('');
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-xl font-semibold mb-2">Manage Budgets</h2>
            <form onSubmit={handleSubmit} className="mb-4">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full mb-2 p-2 border rounded"
                >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <input
                    type="number"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    placeholder="Budget amount"
                    className="w-full mb-2 p-2 border rounded"
                />
                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">
                    Set Budget
                </button>
            </form>
            <div>
                <h3 className="font-semibold mb-2">Current Budgets:</h3>
                {categories.map(category => {
                    const budget = budgets[category] || 0;
                    const spending = getCategorySpending(category);
                    const percentage = budget ? (spending / budget) * 100 : 0;
                    return (
                        <div key={category} className="mb-2">
                            <div className="flex justify-between">
                                <span>{category}</span>
                                <span>${spending.toFixed(2)} / ${budget.toFixed(2)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className={`h-2.5 rounded-full ${percentage > 100 ? 'bg-red-600' : 'bg-blue-600'}`}
                                    style={{width: `${Math.min(percentage, 100)}%`}}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default BudgetManager;