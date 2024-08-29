import React, { useState } from 'react';
import { motion } from 'framer-motion';

function UserProfile({ user, onUpdateUser }) {
    const [name, setName] = useState(user.name || '');
    const [avatar, setAvatar] = useState(user.avatar || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdateUser({ name, avatar });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center space-x-4">
                    <img
                        src={avatar || 'https://via.placeholder.com/100'}
                        alt="User avatar"
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                        <label htmlFor="avatar-upload" className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                            Change Avatar
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
}

function CategoryManager({ categories, onAddCategory, onDeleteCategory }) {
    const [newCategory, setNewCategory] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newCategory.trim()) {
            onAddCategory(newCategory.trim());
            setNewCategory('');
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Manage Categories</h2>
            <form onSubmit={handleSubmit} className="mb-4 flex">
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                    className="flex-grow p-2 border rounded-l focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    type="submit"
                    className="bg-green-500 text-white py-2 px-4 rounded-r hover:bg-green-600 transition"
                >
                    Add Category
                </button>
            </form>
            <ul className="space-y-2">
                {categories.map(category => (
                    <li key={category} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                        {category}
                        <button
                            onClick={() => onDeleteCategory(category)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ExportImportManager({ onExport, onImport }) {
    const handleImport = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                onImport(content);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Export/Import Data</h2>
            <div className="flex space-x-4">
                <button
                    onClick={onExport}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                    Export Data
                </button>
                <div>
                    <label htmlFor="import-file" className="cursor-pointer bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition">
                        Import Data
                    </label>
                    <input
                        id="import-file"
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                    />
                </div>
            </div>
        </div>
    );
}

function Settings({ user, onUpdateUser, categories, onAddCategory, onDeleteCategory, onExportData, onImportData }) {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
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
            </div>
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
                    <ExportImportManager
                        onExport={onExportData}
                        onImport={onImportData}
                    />
                )}
            </motion.div>
        </div>
    );
}

export default Settings;