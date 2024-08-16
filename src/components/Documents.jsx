import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudArrowUpIcon, XMarkIcon, ArrowDownTrayIcon, DocumentIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

function Documents() {
    const [documents, setDocuments] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [categories, setCategories] = useState(['Receipt', 'Invoice', 'Bill', 'Other']);
    const [tags, setTags] = useState(['Food', 'Transport', 'Utilities', 'Entertainment']);
    const [newCategory, setNewCategory] = useState('');
    const [newTag, setNewTag] = useState('');
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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

    const downloadDocument = (format) => {
        // This is a placeholder function. In a real app, you'd convert the file to the chosen format here.
        console.log(`Downloading document in ${format} format`);
    };

    const filteredDocuments = useMemo(() => {
        return documents.filter(doc =>
            doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [documents, searchTerm]);

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Documents</h1>

            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                </div>
            </div>

            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400"/>
                <p className="mt-2 text-sm text-gray-600">Drag and drop your receipts here, or click to select files</p>
                <input
                    type="file"
                    multiple
                    onChange={handleChange}
                    className="hidden"
                    id="file-upload"
                    accept="image/*"
                />
                <label htmlFor="file-upload"
                       className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                    Select files
                </label>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                    {filteredDocuments.map(doc => (
                        <motion.div
                            key={doc.id}
                            initial={{opacity: 0, scale: 0.8}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0.8}}
                            whileHover={{scale: 1.05}}
                            className="relative bg-white p-4 rounded-lg shadow cursor-pointer"
                            onClick={() => setSelectedDocument(doc)}
                        >
                            <img src={doc.url} alt={doc.name} className="w-full h-40 object-cover rounded-lg mb-2"/>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.date}</p>

                            <div className="mt-2">
                                <select
                                    value={doc.category || ''}
                                    onChange={(e) => updateDocument(doc.id, {category: e.target.value})}
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const newTags = doc.tags.includes(tag)
                                                ? doc.tags.filter(t => t !== tag)
                                                : [...doc.tags, tag];
                                            updateDocument(doc.id, {tags: newTags});
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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeDocument(doc.id);
                                }}
                                className="absolute top-2 right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                            >
                                <XMarkIcon className="h-4 w-4"/>
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
                        <PlusIcon className="h-5 w-5"/>
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
                        <PlusIcon className="h-5 w-5"/>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {selectedDocument && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedDocument(null)}
                    >
                        <motion.div
                            initial={{scale: 0.8}}
                            animate={{scale: 1}}
                            exit={{scale: 0.8}}
                            className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">{selectedDocument.name}</h2>
                                <div className="flex space-x-2">
                                    <button onClick={() => downloadDocument('pdf')}
                                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                        <ArrowDownTrayIcon className="h-5 w-5"/>
                                    </button>
                                    <button onClick={() => downloadDocument('jpg')}
                                            className="p-2 bg-green-500 text-white rounded hover:bg-green-600">
                                        <DocumentIcon className="h-5 w-5"/>
                                    </button>
                                </div>
                            </div>
                            <img src={selectedDocument.url} alt={selectedDocument.name} className="w-full rounded-lg"/>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Documents;