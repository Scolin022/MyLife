import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, PlusIcon, TrashIcon, PencilIcon, CheckIcon, XMarkIcon, ArrowPathIcon, ClipboardIcon, ClipboardDocumentCheckIcon, LinkIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import usePasswordManager from './hooks/usePasswordManager';
import { Toaster, toast } from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

const CustomToast = ({ message }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="bg-gray-700 text-white rounded-lg p-3 shadow-lg flex items-center"
    >
        <CheckIcon className="h-5 w-5 mr-2" />
        {message}
    </motion.div>
);

function PasswordManager() {
    const {
        passwords,
        newPassword,
        editingId,
        editPassword,
        handleInputChange,
        handleSubmit,
        handleDelete,
        toggleShowPassword,
        handleGeneratePassword,
        setNewPassword,
        setPasswordLength,
        passwordLength,
        handleEditChange,
        startEditing,
        cancelEditing,
        saveEdit,
        handleGenerateEditPassword,
        showPassword,
    } = usePasswordManager();

    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedFields, setCopiedFields] = useState({});
    const [expandedItems, setExpandedItems] = useState({});

    const filteredPasswords = passwords.filter(pw =>
        pw.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pw.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pw.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pw.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pw.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCopy = async (text, field, pwId) => {
        const success = await copyToClipboard(text, field);
        if (success) {
            setCopiedFields({ ...copiedFields, [pwId]: { ...copiedFields[pwId], [field]: true } });
            setTimeout(() => {
                setCopiedFields({ ...copiedFields, [pwId]: { ...copiedFields[pwId], [field]: false } });
            }, 2000);

            toast.custom((t) => (
                <CustomToast message={`${field.charAt(0).toUpperCase() + field.slice(1)} copied!`} />
            ), {
                duration: 2000,
            });
        }
    };

    const toggleExpand = (pwId) => {
        setExpandedItems(prev => ({ ...prev, [pwId]: !prev[pwId] }));
    };

    const OptionalInput = ({ name, value, onChange, onClear, placeholder }) => (
        <div className="relative mb-2">
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full p-2 pr-8 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {value && (
                <button
                    type="button"
                    onClick={() => onClear(name)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    <XMarkIcon className="h-4 w-4" />
                </button>
            )}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-8">
            <Toaster
                position="bottom-center"
                toastOptions={{
                    duration: 2000,
                    style: {
                        background: 'transparent',
                        boxShadow: 'none',
                    },
                }}
            />
            <h2 className="text-3xl font-bold mb-6">Your Accounts</h2>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search passwords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <AnimatePresence>
                {filteredPasswords.map(pw => (
                    <motion.div
                        key={pw.id}
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: 20}}
                        className="bg-white rounded-lg shadow-md p-4 mb-4 transition-all duration-300 ease-in-out hover:shadow-lg relative"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                                <h3 className="font-bold text-lg text-gray-800 mr-2">{pw.name}</h3>
                                <Tooltip id={`expand-tooltip-${pw.id}`} />
                                <button
                                    data-tooltip-id={`expand-tooltip-${pw.id}`}
                                    data-tooltip-content={expandedItems[pw.id] ? "See less" : "See all"}
                                    onClick={() => toggleExpand(pw.id)}
                                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                >
                                    {expandedItems[pw.id] ? <ChevronUpIcon className="h-6 w-6" /> : <ChevronDownIcon className="h-6 w-6" />}
                                </button>
                            </div>
                            <div className="flex items-center">
                                {pw.url && (
                                    <>
                                        <Tooltip id={`url-tooltip-${pw.id}`}/>
                                        <button
                                            data-tooltip-id={`url-tooltip-${pw.id}`}
                                            data-tooltip-content="Copy URL"
                                            onClick={() => handleCopy(pw.url, 'URL', pw.id)}
                                            className="text-blue-500 hover:text-blue-700 mr-2 transition-colors duration-200"
                                        >
                                            <LinkIcon className="h-5 w-5"/>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{pw.description}</p>
                        {editingId === pw.id ? (
                            <div className="flex-grow mr-4">
                                <input
                                    type="text"
                                    name="name"
                                    value={editPassword.name}
                                    onChange={handleEditChange}
                                    className="w-full mb-2 p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <input
                                    type="text"
                                    name="description"
                                    value={editPassword.description}
                                    onChange={handleEditChange}
                                    className="w-full mb-2 p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Description"
                                />
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <OptionalInput
                                        name="email"
                                        value={editPassword.email}
                                        onChange={handleEditChange}
                                        onClear={(name) => handleEditChange({target: {name, value: ''}})}
                                        placeholder="Email (optional)"
                                    />
                                    <OptionalInput
                                        name="username"
                                        value={editPassword.username}
                                        onChange={handleEditChange}
                                        onClear={(name) => handleEditChange({target: {name, value: ''}})}
                                        placeholder="Username (optional)"
                                    />
                                </div>
                                <OptionalInput
                                    name="phone"
                                    value={editPassword.phone}
                                    onChange={handleEditChange}
                                    onClear={(name) => handleEditChange({target: {name, value: ''}})}
                                    placeholder="Phone (optional)"
                                />
                                <div className="flex mb-2">
                                    <input
                                        type="password"
                                        name="password"
                                        value={editPassword.password}
                                        onChange={handleEditChange}
                                        className="flex-grow p-2 border rounded-l shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleGenerateEditPassword}
                                        className="bg-green-500 text-white p-2 rounded-r hover:bg-green-600 transition-colors duration-200"
                                    >
                                        <ArrowPathIcon className="h-5 w-5"/>
                                    </button>
                                </div>
                                <textarea
                                    name="notes"
                                    value={editPassword.notes}
                                    onChange={handleEditChange}
                                    placeholder="Notes (optional)"
                                    className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows="3"
                                />
                            </div>
                        ) : (
                            <div>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    {pw.email && (
                                        <p className="text-sm text-gray-700 flex items-center">
                                            Email: <span className="font-medium ml-2">{pw.email}</span>
                                            <Tooltip id={`email-tooltip-${pw.id}`}/>
                                            <button
                                                data-tooltip-id={`email-tooltip-${pw.id}`}
                                                data-tooltip-content="Copy email"
                                                onClick={() => handleCopy(pw.email, 'email', pw.id)}
                                                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                            >
                                                {copiedFields[pw.id]?.email ?
                                                    <ClipboardDocumentCheckIcon className="h-5 w-5"/> :
                                                    <ClipboardIcon className="h-5 w-5"/>}
                                            </button>
                                        </p>
                                    )}
                                    {pw.username && (
                                        <p className="text-sm text-gray-700 flex items-center">
                                            Username: <span className="font-medium ml-2">{pw.username}</span>
                                            <Tooltip id={`username-tooltip-${pw.id}`}/>
                                            <button
                                                data-tooltip-id={`username-tooltip-${pw.id}`}
                                                data-tooltip-content="Copy username"
                                                onClick={() => handleCopy(pw.username, 'username', pw.id)}
                                                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                            >
                                                {copiedFields[pw.id]?.username ?
                                                    <ClipboardDocumentCheckIcon className="h-5 w-5"/> :
                                                    <ClipboardIcon className="h-5 w-5"/>}
                                            </button>
                                        </p>
                                    )}
                                </div>
                                <p className="text-sm text-gray-700 flex items-center mb-2">
                                    Password:
                                    <span className="font-medium ml-2">
                                        {showPassword[pw.id] ? pw.password : '••••••••'}
                                    </span>
                                    <Tooltip id={`toggle-tooltip-${pw.id}`}/>
                                    <button
                                        data-tooltip-id={`toggle-tooltip-${pw.id}`}
                                        data-tooltip-content={showPassword[pw.id] ? "Hide password" : "Show password"}
                                        onClick={() => toggleShowPassword(pw.id)}
                                        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    >
                                        {showPassword[pw.id] ? <EyeSlashIcon className="h-5 w-5"/> :
                                            <EyeIcon className="h-5 w-5"/>}
                                    </button>
                                    <Tooltip id={`password-tooltip-${pw.id}`}/>
                                    <button
                                        data-tooltip-id={`password-tooltip-${pw.id}`}
                                        data-tooltip-content="Copy password"
                                        onClick={() => handleCopy(pw.password, 'password', pw.id)}
                                        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    >
                                        {copiedFields[pw.id]?.password ?
                                            <ClipboardDocumentCheckIcon className="h-5 w-5"/> :
                                            <ClipboardIcon className="h-5 w-5"/>}
                                    </button>
                                </p>
                                <div className={`transition-all duration-300 ease-in-out ${expandedItems[pw.id] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                    {pw.phone && (
                                        <p className="text-sm text-gray-700 flex items-center mb-2">
                                            Phone: <span className="font-medium ml-2">{pw.phone}</span>
                                            <Tooltip id={`phone-tooltip-${pw.id}`}/>
                                            <button
                                                data-tooltip-id={`phone-tooltip-${pw.id}`}
                                                data-tooltip-content="Copy phone"
                                                onClick={() => handleCopy(pw.phone, 'phone', pw.id)}
                                                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                            >
                                                {copiedFields[pw.id]?.phone ?
                                                    <ClipboardDocumentCheckIcon className="h-5 w-5"/> :
                                                    <ClipboardIcon className="h-5 w-5"/>}
                                            </button>
                                        </p>
                                    )}
                                    {pw.notes && (
                                        <p className="text-sm text-gray-700 mb-2">
                                            Notes: <span className="font-medium">{pw.notes}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="flex items-center mt-4">
                            {editingId === pw.id ? (
                                <>
                                    <Tooltip id={`save-tooltip-${pw.id}`}/>
                                    <button
                                        data-tooltip-id={`save-tooltip-${pw.id}`}
                                        data-tooltip-content="Save changes"
                                        onClick={saveEdit}
                                        className="text-green-500 hover:text-green-700 mr-2 transition-colors duration-200"
                                    >
                                        <CheckIcon className="h-5 w-5"/>
                                    </button>
                                    <Tooltip id={`cancel-tooltip-${pw.id}`}/>
                                    <button
                                        data-tooltip-id={`cancel-tooltip-${pw.id}`}
                                        data-tooltip-content="Cancel editing"
                                        onClick={cancelEditing}
                                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                    >
                                        <XMarkIcon className="h-5 w-5"/>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Tooltip id={`edit-tooltip-${pw.id}`}/>
                                    <button
                                        data-tooltip-id={`edit-tooltip-${pw.id}`}
                                        data-tooltip-content="Edit"
                                        onClick={() => startEditing(pw)}
                                        className="text-blue-500 hover:text-blue-700 mr-2 transition-colors duration-200"
                                    >
                                        <PencilIcon className="h-5 w-5"/>
                                    </button>
                                    <Tooltip id={`delete-tooltip-${pw.id}`}/>
                                    <button
                                        data-tooltip-id={`delete-tooltip-${pw.id}`}
                                        data-tooltip-content="Delete"
                                        onClick={() => handleDelete(pw.id)}
                                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                    >
                                        <TrashIcon className="h-5 w-5"/>
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="bg-white rounded-lg p-8 w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold">Add New Password</h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                            <form onSubmit={(e) => { handleSubmit(e); setShowModal(false); }} className="space-y-4">
                                <input
                                    type="text"
                                    name="name"
                                    value={newPassword.name}
                                    onChange={handleInputChange}
                                    placeholder="Service Name"
                                    className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                <input
                                    type="text"
                                    name="description"
                                    value={newPassword.description}
                                    onChange={handleInputChange}
                                    placeholder="Description"
                                    className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <input
                                    type="url"
                                    name="url"
                                    value={newPassword.url}
                                    onChange={handleInputChange}
                                    placeholder="URL"
                                    className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={newPassword.email}
                                    onChange={handleInputChange}
                                    placeholder="Email (optional)"
                                    className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <input
                                    type="text"
                                    name="username"
                                    value={newPassword.username}
                                    onChange={handleInputChange}
                                    placeholder="Username (optional)"
                                    className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={newPassword.phone}
                                    onChange={handleInputChange}
                                    placeholder="Phone (optional)"
                                    className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <div className="flex">
                                    <input
                                        type="password"
                                        name="password"
                                        value={newPassword.password}
                                        onChange={handleInputChange}
                                        placeholder="Password"
                                        className="flex-grow p-2 border rounded-l shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={handleGeneratePassword}
                                        className="bg-green-500 text-white p-2 rounded-r hover:bg-green-600 transition-colors duration-200"
                                    >
                                        <ArrowPathIcon className="h-5 w-5"/>
                                    </button>
                                </div>
                                <textarea
                                    name="notes"
                                    value={newPassword.notes}
                                    onChange={handleInputChange}
                                    placeholder="Notes (optional)"
                                    className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows="3"
                                />
                                <div className="flex items-center">
                                    <label htmlFor="passwordLength" className="mr-2">Password Length:</label>
                                    <input
                                        type="number"
                                        id="passwordLength"
                                        value={passwordLength}
                                        onChange={(e) => setPasswordLength(Number(e.target.value))}
                                        min="8"
                                        max="32"
                                        className="w-16 p-1 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                                >
                                    Add Password
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Tooltip id="add-password-tooltip" />
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowModal(true)}
                className="fixed bottom-8 right-8 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-colors duration-200"
                data-tooltip-id="add-password-tooltip"
                data-tooltip-content="Add new password"
            >
                <PlusIcon className="h-6 w-6"/>
            </motion.button>
        </div>
    );
}

export default PasswordManager;