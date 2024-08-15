import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-dom-confetti';

const confettiConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
};

function GoalTracker({ goals, addGoal, updateGoal, deleteGoal }) {
    const [newGoal, setNewGoal] = useState({ name: '', targetAmount: '', currentAmount: 0, deadline: '' });
    const [celebratingGoal, setCelebratingGoal] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        addGoal({ ...newGoal, id: Date.now() });
        setNewGoal({ name: '', targetAmount: '', currentAmount: 0, deadline: '' });
    };

    const handleUpdateGoal = (id, newAmount) => {
        const updatedGoal = goals.find(goal => goal.id === id);
        if (updatedGoal) {
            const updatedCurrentAmount = parseFloat(updatedGoal.currentAmount) + parseFloat(newAmount);
            updateGoal(id, updatedCurrentAmount);

            if (updatedCurrentAmount >= parseFloat(updatedGoal.targetAmount) && !celebratingGoal) {
                setCelebratingGoal(id);
            }
        }
    };

    useEffect(() => {
        if (celebratingGoal) {
            const timer = setTimeout(() => {
                setCelebratingGoal(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [celebratingGoal]);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Financial Goals</h1>
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Add New Goal</h2>
                <form onSubmit={handleSubmit} className="mb-6">
                    <input
                        type="text"
                        placeholder="Goal Name"
                        value={newGoal.name}
                        onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                        className="w-full mb-2 p-2 border rounded"
                    />
                    <input
                        type="number"
                        placeholder="Target Amount"
                        value={newGoal.targetAmount}
                        onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                        className="w-full mb-2 p-2 border rounded"
                    />
                    <input
                        type="date"
                        placeholder="Deadline"
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                        className="w-full mb-2 p-2 border rounded"
                    />
                    <button type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
                        Add Goal
                    </button>
                </form>
                <div className="space-y-4">
                    {goals.map((goal) => (
                        <motion.div
                            key={goal.id}
                            className="bg-gray-100 p-4 rounded-lg relative overflow-hidden"
                            initial={{opacity: 0, y: 50}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5}}
                        >
                            <h3 className="text-xl font-semibold">{goal.name}</h3>
                            <p>Target: ${goal.targetAmount}</p>
                            <p>Current: ${goal.currentAmount}</p>
                            <p>Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
                            <div className="mt-2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <motion.div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                ></motion.div>
                            </div>
                            <div className="mt-2">
                                <input
                                    type="number"
                                    placeholder="Add progress"
                                    className="p-1 border rounded mr-2"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleUpdateGoal(goal.id, e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => deleteGoal(goal.id)}
                                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                            </div>
                            <AnimatePresence>
                                {celebratingGoal === goal.id && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg">
                                            <h3 className="text-2xl font-bold">Goal Achieved!</h3>
                                            <p>Congratulations on reaching your goal!</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <Confetti active={celebratingGoal === goal.id} config={confettiConfig} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GoalTracker;