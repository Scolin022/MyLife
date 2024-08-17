import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, PlusIcon, TrashIcon, PencilIcon, CheckIcon, XMarkIcon, ArrowPathIcon, ClipboardIcon, DocumentTextIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';

function generateSecurePassword(length = 16) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';
    const allChars = lowercase + uppercase + numbers + symbols;

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        password += allChars[randomIndex];
    }

    return password;
}

function PasswordManager() {
    const [passwords, setPasswords] = useState([]);
    const [newPassword, setNewPassword] = useState({ name: '', description: '', url: '', username: '', password: '', notes: '', attachments: [] });
    const [editingId, setEditingId] = useState(null);
    const [editPassword, setEditPassword] = useState({ site: '', username: '', password: '', notes: '', attachments: [] });
    const [passwordLength, setPasswordLength] = useState(16);
    const [selectedPassword, setSelectedPassword] = useState(null);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPassword, setShowPassword] = useState({});

    useEffect(() => {
        const storedPasswords = localStorage.getItem('passwords');
        if (storedPasswords) {
            setPasswords(JSON.parse(storedPasswords));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('passwords', JSON.stringify(passwords));
    }, [passwords]);

    const handleInputChange = (e) => {
        setNewPassword({ ...newPassword, [e.target.name]: e.target.value });
    };

    const handleEditChange = (e) => {
        setEditPassword({ ...editPassword, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPasswordEntry = { ...newPassword, id: Date.now() };
        setPasswords([...passwords, newPasswordEntry]);
        setNewPassword({ name: '', description: '', url: '', username: '', password: '', notes: '', attachments: [] });
    };

    const handleDelete = (id) => {
        setPasswords(passwords.filter(pw => pw.id !== id));
    };

    const toggleShowPassword = (id) => {
        setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
    };
    const startEditing = (password) => {
        setEditingId(password.id);
        setEditPassword({ ...password });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditPassword({ site: '', username: '', password: '', notes: '', attachments: [] });
    };

    const saveEdit = () => {
        setPasswords(passwords.map(pw =>
            pw.id === editingId ? { ...editPassword, id: editingId } : pw
        ));
        setEditingId(null);
        setEditPassword({ site: '', username: '', password: '', notes: '', attachments: [] });
    };

    const handleGeneratePassword = () => {
        const newGeneratedPassword = generateSecurePassword(passwordLength);
        setNewPassword({ ...newPassword, password: newGeneratedPassword });
    };

    const handleGenerateEditPassword = () => {
        const newGeneratedPassword = generateSecurePassword(passwordLength);
        setEditPassword({ ...editPassword, password: newGeneratedPassword });
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success(`Password copied!`, {
                duration: 2000,
                position: 'bottom-center',
                icon: '✅',
                style: {
                    borderRadius: '8px',
                    padding: '16px',
                    color: '#fff',
                    background: '#4a5568',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                },
            });
        }, (err) => {
            console.error('Could not copy text: ', err);
            toast.error(`Failed to copy ${type.toLowerCase()}`);
        });
    };

    const handleNotesClick = (password) => {
        setSelectedPassword(password);
        setIsEditingNotes(false);
    };

    const handleNotesChange = (e) => {
        setSelectedPassword({ ...selectedPassword, notes: e.target.value });
    };

    const saveNotes = () => {
        setPasswords(passwords.map(pw =>
            pw.id === selectedPassword.id ? { ...selectedPassword } : pw
        ));
        setSelectedPassword(null);
        setIsEditingNotes(false);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedPassword({
                    ...selectedPassword,
                    attachments: [...selectedPassword.attachments, { name: file.name, data: reader.result }]
                });
            };
            reader.readAsDataURL(file);
        }
    };


    const filteredPasswords = passwords.filter(pw =>
        pw.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pw.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pw.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-4xl mx-auto py-8">
            <Toaster/>
            <h2 className="text-3xl font-bold mb-6">Password Manager</h2>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search passwords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>

            <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow">
                <input
                    type="text"
                    name="name"
                    value={newPassword.name}
                    onChange={handleInputChange}
                    placeholder="Service Name"
                    className="w-full mb-4 p-2 border rounded"
                    required
                />
                <input
                    type="text"
                    name="description"
                    value={newPassword.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    className="w-full mb-4 p-2 border rounded"
                />
                <input
                    type="url"
                    name="url"
                    value={newPassword.url}
                    onChange={handleInputChange}
                    placeholder="URL"
                    className="w-full mb-4 p-2 border rounded"
                />
                <input
                    type="text"
                    name="username"
                    value={newPassword.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                    className="w-full mb-4 p-2 border rounded"
                    required
                />
                <div className="flex mb-4">
                    <input
                        type="password"
                        name="password"
                        value={newPassword.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        className="flex-grow p-2 border rounded-l"
                        required
                    />
                    <button
                        type="button"
                        onClick={handleGeneratePassword}
                        className="bg-green-500 text-white p-2 rounded-r hover:bg-green-600 transition"
                    >
                        <ArrowPathIcon className="h-5 w-5"/>
                    </button>
                </div>
                <textarea
                    name="notes"
                    value={newPassword.notes}
                    onChange={handleInputChange}
                    placeholder="Notes (optional)"
                    className="w-full mb-4 p-2 border rounded"
                    rows="3"
                />
                <div className="flex items-center mb-4">
                    <label htmlFor="passwordLength" className="mr-2">Password Length:</label>
                    <input
                        type="number"
                        id="passwordLength"
                        value={passwordLength}
                        onChange={(e) => setPasswordLength(Number(e.target.value))}
                        min="8"
                        max="32"
                        className="w-16 p-1 border rounded"
                    />
                </div>
                <button type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
                    <PlusIcon className="h-5 w-5 inline mr-2"/>
                    Add Password
                </button>
            </form>
            <>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {filteredPasswords && filteredPasswords.map(pw => (
                        <div key={pw.id} className="p-4 border-b last:border-b-0">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold">{pw.name}</h3>
                                    <p className="text-sm text-gray-600">{pw.description}</p>
                                </div>
                                <div className="flex items-center">
                                    {pw.url && (
                                        <button
                                            onClick={() => copyToClipboard(pw.url, 'URL')}
                                            className="text-blue-500 hover:text-blue-700 mr-2"
                                            title="Copy URL"
                                        >
                                            <ClipboardIcon className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            {editingId === pw.id ? (
                                <div className="flex-grow mr-4">
                                    <input
                                        type="text"
                                        name="site"
                                        value={editPassword.site}
                                        onChange={handleEditChange}
                                        className="w-full mb-2 p-1 border rounded"
                                    />
                                    <input
                                        type="text"
                                        name="username"
                                        value={editPassword.username}
                                        onChange={handleEditChange}
                                        className="w-full mb-2 p-1 border rounded"
                                    />
                                    <div className="flex mb-2">
                                        <input
                                            type="password"
                                            name="password"
                                            value={editPassword.password}
                                            onChange={handleEditChange}
                                            className="flex-grow p-1 border rounded-l"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleGenerateEditPassword}
                                            className="bg-green-500 text-white p-1 rounded-r hover:bg-green-600 transition"
                                        >
                                            <ArrowPathIcon className="h-4 w-4"/>
                                        </button>
                                    </div>
                                    <textarea
                                        name="notes"
                                        value={editPassword.notes}
                                        onChange={handleEditChange}
                                        placeholder="Notes (optional)"
                                        className="w-full p-1 border rounded"
                                        rows="3"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm text-black-600">Username: {pw.username}</p>
                                    <p className="text-sm flex items-center">
                                        Password:
                                        <span className="ml-2">
                                            {showPassword[pw.id] ? pw.password : '••••••••'}
                                        </span>
                                        <button onClick={() => toggleShowPassword(pw.id)}
                                                className="ml-2 text-blue-500">
                                            {showPassword[pw.id] ? <EyeSlashIcon className="h-5 w-5 inline"/> :
                                                <EyeIcon className="h-5 w-5 inline"/>}
                                        </button>
                                        <button
                                            onClick={() => copyToClipboard(pw.password, pw.name)}
                                            className="ml-2 text-green-500 hover:text-green-700"
                                            title="Copy password to clipboard"
                                        >
                                            <ClipboardIcon className="h-5 w-5 inline"/>
                                        </button>
                                    </p>
                                </div>
                            )}
                            <div className="flex items-center">
                                <button
                                    onClick={() => handleNotesClick(pw)}
                                    className={`mr-2 ${pw.notes || pw.attachments.length > 0 ? 'text-yellow-500' : 'text-gray-400'}`}
                                    disabled={!pw.notes && pw.attachments.length === 0}
                                >
                                    <DocumentTextIcon className="h-5 w-5"/>
                                </button>
                                {editingId === pw.id ? (
                                    <>
                                        <button onClick={saveEdit} className="text-green-500 hover:text-green-700 mr-2">
                                            <CheckIcon className="h-5 w-5"/>
                                        </button>
                                        <button onClick={cancelEditing} className="text-red-500 hover:text-red-700">
                                            <XMarkIcon className="h-5 w-5"/>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => startEditing(pw)}
                                                className="text-blue-500 hover:text-blue-700 mr-2">
                                            <PencilIcon className="h-5 w-5"/>
                                        </button>
                                        <button onClick={() => handleDelete(pw.id)}
                                                className="text-red-500 hover:text-red-700">
                                            <TrashIcon className="h-5 w-5"/>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <AnimatePresence>
                    {selectedPassword && (
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                            onClick={() => setSelectedPassword(null)}
                        >
                            <motion.div
                                initial={{scale: 0.8}}
                                animate={{scale: 1}}
                                exit={{scale: 0.8}}
                                className="bg-white p-6 rounded-lg max-w-lg w-full relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setSelectedPassword(null)}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                >
                                    <XMarkIcon className="h-6 w-6"/>
                                </button>
                                <h3 className="text-xl font-bold mb-4">{selectedPassword.site} Notes</h3>
                                {isEditingNotes ? (
                                    <textarea
                                        value={selectedPassword.notes}
                                        onChange={handleNotesChange}
                                        className="w-full h-40 p-2 border rounded mb-4"
                                        placeholder="Enter notes here..."
                                    />
                                ) : (
                                    <p className="mb-4">{selectedPassword.notes || 'No notes added yet.'}</p>
                                )}
                                <h4 className="font-bold mb-2">Attachments:</h4>
                                <ul className="mb-4">
                                    {selectedPassword.attachments.map((attachment, index) => (
                                        <li key={index} className="flex items-center mb-2">
                                            <PaperClipIcon className="h-5 w-5 mr-2"/>
                                            <a href={attachment.data} download={attachment.name}
                                               className="text-blue-500 hover:underline">
                                                {attachment.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                                <input
                                    type="file"
                                    onChange={handleFileUpload}
                                    className="mb-4"
                                />
                                <div className="flex justify-end">
                                    {isEditingNotes ? (
                                        <>
                                            <button
                                                onClick={() => setIsEditingNotes(false)}
                                                className="mr-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={saveNotes}
                                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Save Notes
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditingNotes(true)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Edit Notes
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </>
        </div>
    );
};

export default PasswordManager;