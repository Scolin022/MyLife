import React from 'react';
import {motion, AnimatePresence} from 'framer-motion';
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
    KeyIcon
} from '@heroicons/react/24/outline';

function Sidebar({activeTab, setActiveTab, user, isOpen, toggleSidebar}) {
    const navItems = [
        {name: 'Dashboard', icon: HomeIcon},
        {name: 'Goals', icon: FlagIcon},
        {name: 'Budget', icon: ChartPieIcon},
        {name: 'Analytics', icon: ArrowTrendingUpIcon},
        {name: 'Transactions', icon: CurrencyDollarIcon},
        {name: 'Planner', icon: CalendarIcon},
        {name: 'Documents', icon: DocumentIcon},
        {name: 'PasswordManager', icon: KeyIcon},
    ];

    const sidebarVariants = {
        open: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 30,
                mass: 0.8,
                when: "beforeChildren",
                staggerChildren: 0.05
            }
        },
        closed: {
            x: "-100%",
            opacity: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 30,
                mass: 0.8,
                when: "afterChildren",
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        open: {opacity: 1, y: 0},
        closed: {opacity: 0, y: 20}
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={sidebarVariants}
                    className="bg-gray-800 text-white w-64 py-7 px-2 absolute inset-y-0 left-0 transform md:relative md:translate-x-0 transition duration-200 ease-in-out z-20 flex flex-col"
                >
                    <motion.div variants={itemVariants} className="flex items-center space-x-2 px-4 mb-6">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt="User avatar"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <UserCircleIcon className="w-10 h-10"/>
                        )}
                        <span className="text-xl font-semibold">{user.name}</span>
                    </motion.div>
                    <nav className="flex-grow">
                        {navItems.map((item, index) => (
                            <motion.a
                                key={item.name}
                                variants={itemVariants}
                                custom={index}
                                href="#"
                                className={`block py-2.5 px-4 rounded transition duration-200 ${
                                    activeTab === item.name ? 'bg-gray-700' : 'hover:bg-gray-700'
                                }`}
                                onClick={() => {
                                    setActiveTab(item.name);
                                    if (window.innerWidth < 768) toggleSidebar();
                                }}
                                whileHover={{scale: 1.02}}
                                whileTap={{scale: 0.98}}
                            >
                                <div className="flex items-center">
                                    <item.icon className="h-6 w-6 mr-3"/>
                                    {item.name}
                                </div>
                            </motion.a>
                        ))}
                    </nav>
                    <motion.a
                        variants={itemVariants}
                        custom={navItems.length}
                        href="#"
                        className={`block py-2.5 px-4 rounded transition duration-200 ${
                            activeTab === 'Settings' ? 'bg-gray-700' : 'hover:bg-gray-700'
                        }`}
                        onClick={() => {
                            setActiveTab('Settings');
                            if (window.innerWidth < 768) toggleSidebar();
                        }}
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                    >
                        <div className="flex items-center">
                            <Cog6ToothIcon className="h-6 w-6 mr-3"/>
                            Settings
                        </div>
                    </motion.a>
                </motion.div>
            )}
        </AnimatePresence>
    );
    }

export default Sidebar;