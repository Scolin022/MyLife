import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudArrowUpIcon, XMarkIcon, TagIcon, PlusIcon } from '@heroicons/react/24/outline';

function Documents() {
    const [documents, setDocuments] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [categories, setCategories] = useState(['Receipt', 'Invoice', 'Bill', 'Other']);
    const [tags, setTags] = useState(['Food', 'Transport', 'Utilities', 'Entertainment']);
    const [newCategory, setNewCategory] = useState('');
    const [newTag, setNewTag] = useState('');

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (files) => {
        const newDocuments = Array.from(files).map(file => ({
            id: Date.now() + Math.random(),
            name: file.name,
            url: URL.createObjectURL(file),
            date: new Date().toLocaleDateString(),
            category: '',
            tags: []
        }));
        setDocuments(prev => [...prev, ...newDocuments]);
    };

    const removeDocument = (id) => {
        setDocuments(documents.filter(doc => doc.id !== id));
    };

    const updateDocument = (id, updates) => {
        setDocuments(documents.map(doc =>
            doc.id === id ? { ...doc, ...updates } : doc
        ));
    };

    const addCategory = () => {
        if (newCategory && !categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
            setNewCategory('');
        }
    };

    const addTag = () => {
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setNewTag('');
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Documents</h1>

            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Drag and drop your receipts here, or click to select files</p>
                <input
                    type="file"
                    multiple
                    onChange={handleChange}
                    className="hidden"
                    id="file-upload"
                    accept="image/*"
                />
                <label htmlFor="file-upload" className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                    Select files
                </label>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                    {documents.map(doc => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative bg-white p-4 rounded-lg shadow"
                        >
                            <img src={doc.url} alt={doc.name} className="w-full h-40 object-cover rounded-lg mb-2" />
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.date}</p>

                            <div className="mt-2">
                                <select
                                    value={doc.category || ''}
                                    onChange={(e) => updateDocument(doc.id, { category: e.target.value })}
                                    className="block w-full mt-1 text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mt-2 flex flex-wrap">
                                {tags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => {
                                            const newTags = doc.tags.includes(tag)
                                                ? doc.tags.filter(t => t !== tag)
                                                : [...doc.tags, tag];
                                            updateDocument(doc.id, { tags: newTags });
                                        }}
                                        className={`m-1 px-2 py-1 text-xs rounded-full ${
                                            doc.tags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => removeDocument(doc.id)}
                                className="absolute top-2 right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="mt-8 bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Manage Categories and Tags</h2>
                <div className="flex mb-4">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New Category"
                        className="flex-grow mr-2 p-2 border rounded text-sm"
                    />
                    <button onClick={addCategory} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        <PlusIcon className="h-5 w-5" />
                    </button>
                </div>
                <div className="flex">
                    <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="New Tag"
                        className="flex-grow mr-2 p-2 border rounded text-sm"
                    />
                    <button onClick={addTag} className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
                        <PlusIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Documents;