import React, { useState } from 'react';

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
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-xl font-semibold mb-2">Manage Categories</h2>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="flex">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New category name"
                        className="flex-grow mr-2 p-2 border rounded"
                    />
                    <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">
                        Add Category
                    </button>
                </div>
            </form>
            <ul>
                {categories.map(category => (
                    <li key={category} className="flex justify-between items-center mb-2">
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

export default CategoryManager;