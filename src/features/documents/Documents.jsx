import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto py-8"
        >
            <motion.h1
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 120 }}
                className="text-3xl font-bold mb-6"
            >
                Documents
            </motion.h1>

            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
            >
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
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        transition: {
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut"
                        }
                    }}
                >
                    <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400"/>
                </motion.div>
                <p className="mt-2 text-sm text-gray-600">Drag and drop any documents here, or click to select files</p>
                <input
                    type="file"
                    multiple
                    onChange={handleChange}
                    className="hidden"
                    id="file-upload"
                    accept="image/*"
                />
                <motion.label
                    htmlFor="file-upload"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                >
                    Select files
                </motion.label>
            </motion.div>

            <LayoutGroup>
                <motion.div
                    layout
                    className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    <AnimatePresence>
                        {filteredDocuments.map(doc => (
                            <motion.div
                                layout
                                key={doc.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ scale: 1.05 }}
                                className="relative bg-white p-4 rounded-lg shadow cursor-pointer"
                                onClick={() => setSelectedDocument(doc)}
                            >
                                <motion.img
                                    src={doc.url}
                                    alt={doc.name}
                                    className="w-full h-40 object-cover rounded-lg mb-2"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <p className="text-sm font-medium">{doc.name}</p>
                                <p className="text-xs text-gray-500">{doc.date}</p>

                                <motion.div
                                    className="mt-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
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
                                </motion.div>

                                <motion.div
                                    className="mt-2 flex flex-wrap"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {tags.map(tag => (
                                        <motion.button
                                            key={tag}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newTags = doc.tags.includes(tag)
                                                    ? doc.tags.filter(t => t !== tag)
                                                    : [...doc.tags, tag];
                                                updateDocument(doc.id, {tags: newTags});
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className={`m-1 px-2 py-1 text-xs rounded-full ${
                                                doc.tags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                                            }`}
                                        >
                                            {tag}
                                        </motion.button>
                                    ))}
                                </motion.div>

                                <motion.button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeDocument(doc.id);
                                    }}
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="absolute top-2 right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                                >
                                    <XMarkIcon className="h-4 w-4"/>
                                </motion.button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </LayoutGroup>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.25 }}
                className="mt-8 bg-white p-4 rounded-lg shadow"
            >
                <h2 className="text-xl font-bold mb-4">Manage Categories and Tags</h2>
                <motion.div
                    className="flex mb-4"
                    initial={{ x: -50 }}
                    animate={{ x: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                >
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New Category"
                        className="flex-grow mr-2 p-2 border rounded text-sm"
                    />
                    <motion.button
                        onClick={addCategory}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        <PlusIcon className="h-5 w-5"/>
                    </motion.button>
                </motion.div>
                <motion.div
                    className="flex"
                    initial={{ x: 50 }}
                    animate={{ x: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                >
                    <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="New Tag"
                        className="flex-grow mr-2 p-2 border rounded text-sm"
                    />
                    <motion.button
                        onClick={addTag}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                    >
                        <PlusIcon className="h-5 w-5"/>
                    </motion.button>
                </motion.div>
            </motion.div>

            <AnimatePresence>
                {selectedDocument && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedDocument(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 50 }}
                            className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">{selectedDocument.name}</h2>
                                <div className="flex space-x-2">
                                    <motion.button
                                        onClick={() => downloadDocument('pdf')}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        <ArrowDownTrayIcon className="h-5 w-5"/>
                                    </motion.button>
                                    <motion.button
                                        onClick={() => downloadDocument('jpg')}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        <DocumentIcon className="h-5 w-5"/>
                                    </motion.button>
                                </div>
                            </div>
                            <motion.img
                                src={selectedDocument.url}
                                alt={selectedDocument.name}
                                className="w-full rounded-lg"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default Documents;