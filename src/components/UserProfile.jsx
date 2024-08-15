import React, { useState, useRef } from 'react';

function UserProfile({ user, onUpdateUser }) {
    const [name, setName] = useState(user.name);
    const [avatar, setAvatar] = useState(user.avatar);
    const fileInputRef = useRef(null);

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
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-xl font-semibold mb-4">User Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Avatar</label>
                    <div className="mt-1 flex items-center">
                        {avatar && (
                            <img src={avatar} alt="Avatar preview" className="w-12 h-12 rounded-full mr-4" />
                        )}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Change Avatar
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Update Profile
                </button>
            </form>
        </div>
    );
}

export default UserProfile;