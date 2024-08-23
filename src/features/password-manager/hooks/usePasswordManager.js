// src/features/password-manager/hooks/usePasswordManager.js

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

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

function usePasswordManager() {
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

    // const copyToClipboard = (text, type) => {
    //     navigator.clipboard.writeText(text).then(() => {
    //     }, (err) => {
    //         console.error('Could not copy text: ', err);
    //         toast.error(`Failed to copy ${type.toLowerCase()}`);
    //     });
    // };

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

    return {
        passwords,
        newPassword,
        editingId,
        editPassword,
        passwordLength,
        selectedPassword,
        isEditingNotes,
        searchTerm,
        showPassword,
        handleInputChange,
        handleEditChange,
        handleSubmit,
        handleDelete,
        toggleShowPassword,
        startEditing,
        cancelEditing,
        saveEdit,
        handleGeneratePassword,
        handleGenerateEditPassword,
        handleNotesClick,
        handleNotesChange,
        saveNotes,
        handleFileUpload,
        setSearchTerm,
        setPasswordLength,
        setSelectedPassword,
        setIsEditingNotes,
    };
}

export default usePasswordManager;