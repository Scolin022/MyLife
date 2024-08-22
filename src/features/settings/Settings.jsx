import React, { useState } from 'react';
import { motion } from 'framer-motion';
import UserProfile from './UserProfile.jsx';
import CategoryManager from './CategoryManager.jsx';
// import ExportImportManager from './ExportImportManager';

function Settings({ user, onUpdateUser, categories, onAddCategory, onDeleteCategory }) {
    const [activeTab, setActiveTab] = useState('profile');

    const handleExportData = () => {
        // Implement export logic here
        console.log('Exporting data...');
    };

    const handleImportData = () => {
        // Implement import logic here
        console.log('Importing data...');
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="flex border-b">
                    <button
                        className={`flex-1 py-3 px-4 text-center font-medium ${
                            activeTab === 'profile' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveTab('profile')}
                    >
                        User Profile
                    </button>
                    <button
                        className={`flex-1 py-3 px-4 text-center font-medium ${
                            activeTab === 'categories' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveTab('categories')}
                    >
                        Manage Categories
                    </button>
                    <button
                        className={`flex-1 py-3 px-4 text-center font-medium ${
                            activeTab === 'data' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveTab('data')}
                    >
                        Export/Import Data
                    </button>
                </div>
                <div className="p-6">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'profile' && (
                            <UserProfile user={user} onUpdateUser={onUpdateUser} />
                        )}
                        {activeTab === 'categories' && (
                            <CategoryManager
                                categories={categories}
                                onAddCategory={onAddCategory}
                                onDeleteCategory={onDeleteCategory}
                            />
                        )}
                        {activeTab === 'data' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Export/Import Data</h2>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={handleExportData}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                                    >
                                        Export Data
                                    </button>
                                    <button
                                        onClick={handleImportData}
                                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                                    >
                                        Import Data
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default Settings;