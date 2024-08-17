import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HomeIcon,
    ChartPieIcon,
    CurrencyDollarIcon,
    ArrowTrendingUpIcon,
    UserCircleIcon,
    FlagIcon,
    Cog6ToothIcon,
    DocumentIcon,
    CalendarIcon,
    KeyIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

function Sidebar({ activeTab, setActiveTab, user, isOpen, toggleSidebar }) {
    const navItems = [
        { name: 'Dashboard', icon: HomeIcon },
        { name: 'Goals', icon: FlagIcon },
        { name: 'Budget', icon: ChartPieIcon },
        { name: 'Analytics', icon: ArrowTrendingUpIcon },
        { name: 'Transactions', icon: CurrencyDollarIcon },
        { name: 'Planner', icon: CalendarIcon },
        { name: 'Documents', icon: DocumentIcon },
        { name: 'PasswordManager', icon: KeyIcon },
    ];
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    exit={{ x: -300 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="bg-gray-800 text-white w-64 py-7 px-2 absolute inset-y-0 left-0 transform md:relative md:translate-x-0 transition duration-200 ease-in-out z-20 flex flex-col"
                >
                    <div className="flex items-center space-x-2 px-4 mb-6">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {user.avatar ? (
                                <motion.img
                                    key={user.avatar}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    src={user.avatar}
                                    alt="User avatar"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <UserCircleIcon className="w-10 h-10" />
                            )}
                        </motion.div>
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                            className="text-xl font-semibold"
                        >
                            {user.name}
                        </motion.span>
                    </div>
                    <nav className="flex-grow">
                        {navItems.map((item) => (
                            <motion.a
                                key={item.name}
                                href="#"
                                className={`block py-2.5 px-4 rounded transition duration-200 ${
                                    activeTab === item.name ? 'bg-gray-700' : 'hover:bg-gray-700'
                                }`}
                                onClick={() => {
                                    setActiveTab(item.name);
                                    if (window.innerWidth < 768) toggleSidebar();
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="flex items-center">
                                    <item.icon className="h-6 w-6 mr-3" />
                                    {item.name}
                                </div>
                            </motion.a>
                        ))}
                    </nav>
                    <motion.a
                        href="#"
                        className={`block py-2.5 px-4 rounded transition duration-200 ${
                            activeTab === 'Settings' ? 'bg-gray-700' : 'hover:bg-gray-700'
                        }`}
                        onClick={() => {
                            setActiveTab('Settings');
                            if (window.innerWidth < 768) toggleSidebar();
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="flex items-center">
                            <Cog6ToothIcon className="h-6 w-6 mr-3" />
                            Settings
                        </div>
                    </motion.a>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default Sidebar;