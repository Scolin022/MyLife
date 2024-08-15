import React from 'react';
import {
    HomeIcon,
    ChartPieIcon,
    CurrencyDollarIcon,
    Cog6ToothIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

function Sidebar({ activeTab, setActiveTab }) {
    const navItems = [
        { name: 'Dashboard', icon: HomeIcon },
        { name: 'Transactions', icon: CurrencyDollarIcon },
        { name: 'Budget', icon: ChartPieIcon },
        { name: 'Analytics', icon: ArrowTrendingUpIcon },
        { name: 'Settings', icon: Cog6ToothIcon },
    ];

    return (
        <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
            <h2 className="text-2xl font-extrabold text-center">Money Moves</h2>
            <nav>
                {navItems.map(item => (
                <a
                    key={item.name}
                    href="#"
                    className={`block py-2.5 px-4 rounded transition duration-200 ${
                    activeTab === item.name ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
                    onClick={() => setActiveTab(item.name)}
                    >
                    <div className="flex items-center">
                    <item.icon className="h-6 w-6 mr-3" />
                {item.name}
                    </div>
                    </a>
                    ))}
</nav>
</div>
);
}

export default Sidebar;