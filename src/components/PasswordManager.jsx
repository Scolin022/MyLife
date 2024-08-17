import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon, PlusIcon, TrashIcon, PencilIcon, CheckIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

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
    const [newPassword, setNewPassword] = useState({ site: '', username: '', password: '' });
    const [showPassword, setShowPassword] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [editPassword, setEditPassword] = useState({ site: '', username: '', password: '' });
    const [passwordLength, setPasswordLength] = useState(16);

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
        setPasswords([...passwords, { ...newPassword, id: Date.now() }]);
        setNewPassword({ site: '', username: '', password: '' });
    };

    const handleDelete = (id) => {
        setPasswords(passwords.filter(pw => pw.id !== id));
    };

    const toggleShowPassword = (id) => {
        setShowPassword({ ...showPassword, [id]: !showPassword[id] });
    };

    const startEditing = (password) => {
        setEditingId(password.id);
        setEditPassword(password);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditPassword({ site: '', username: '', password: '' });
    };

    const saveEdit = () => {
        setPasswords(passwords.map(pw =>
            pw.id === editingId ? { ...editPassword, id: editingId } : pw
        ));
        setEditingId(null);
        setEditPassword({ site: '', username: '', password: '' });
    };

    const handleGeneratePassword = () => {
        const newGeneratedPassword = generateSecurePassword(passwordLength);
        setNewPassword({ ...newPassword, password: newGeneratedPassword });
    };

    const handleGenerateEditPassword = () => {
        const newGeneratedPassword = generateSecurePassword(passwordLength);
        setEditPassword({ ...editPassword, password: newGeneratedPassword });
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h2 className="text-3xl font-bold mb-6">Password Manager</h2>
            <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow">
                <input
                    type="text"
                    name="site"
                    value={newPassword.site}
                    onChange={handleInputChange}
                    placeholder="Website"
                    className="w-full mb-4 p-2 border rounded"
                    required
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
                        <ArrowPathIcon className="h-5 w-5" />
                    </button>
                </div>
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
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
                    <PlusIcon className="h-5 w-5 inline mr-2" />
                    Add Password
                </button>
            </form>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {passwords.map(pw => (
                    <div key={pw.id} className="p-4 border-b last:border-b-0 flex justify-between items-center">
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
                                <div className="flex">
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
                                        <ArrowPathIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h3 className="font-bold">{pw.site}</h3>
                                <p className="text-sm text-gray-600">{pw.username}</p>
                                <p className="text-sm">
                                    Password:
                                    <span className="ml-2">
                                        {showPassword[pw.id] ? pw.password : '••••••••'}
                                    </span>
                                    <button onClick={() => toggleShowPassword(pw.id)} className="ml-2 text-blue-500">
                                        {showPassword[pw.id] ? <EyeSlashIcon className="h-5 w-5 inline" /> : <EyeIcon className="h-5 w-5 inline" />}
                                    </button>
                                </p>
                            </div>
                        )}
                        <div className="flex items-center">
                            {editingId === pw.id ? (
                                <>
                                    <button onClick={saveEdit} className="text-green-500 hover:text-green-700 mr-2">
                                        <CheckIcon className="h-5 w-5" />
                                    </button>
                                    <button onClick={cancelEditing} className="text-red-500 hover:text-red-700">
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => startEditing(pw)} className="text-blue-500 hover:text-blue-700 mr-2">
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => handleDelete(pw.id)} className="text-red-500 hover:text-red-700">
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PasswordManager;