import React from 'react';
import { motion } from 'framer-motion';
import {
    HomeIcon,
    ChartPieIcon,
    CurrencyDollarIcon,
    Cog6ToothIcon,
    ArrowTrendingUpIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline';

function Sidebar({ activeTab, setActiveTab, user }) {
    const navItems = [
        { name: 'Dashboard', icon: HomeIcon },
        { name: 'Transactions', icon: CurrencyDollarIcon },
        { name: 'Budget', icon: ChartPieIcon },
        { name: 'Analytics', icon: ArrowTrendingUpIcon },
        { name: 'Settings', icon: Cog6ToothIcon },
    ];

    return (
        <motion.div
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 80 }}
            className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-100 ease-in-out"
        >
            <div className="flex items-center space-x-2 px-4 mb-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.1 }}
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
                    transition={{ delay: 0.2, duration: 0.1 }}
                    className="text-xl font-semibold"
                >
                    {user.name}
                </motion.span>
            </div>
            <h2 className="text-2xl font-extrabold text-center">Money Moves</h2>
            <nav>
                {navItems.map((item) => (
                    <motion.a
                        key={item.name}
                        href="#"
                        className={`block py-2.5 px-4 rounded transition duration-100 ${
                            activeTab === item.name ? 'bg-gray-700' : 'hover:bg-gray-700'
                        }`}
                        onClick={() => setActiveTab(item.name)}
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
        </motion.div>
    );
}

export default Sidebar;