import React, { useState, useMemo, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import { useLoadScript } from '@react-google-maps/api';
import AddressInput from './AddressInput';
import { motion, AnimatePresence } from 'framer-motion';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const categories = [
    { name: 'Work', color: '#3174ad' },
    { name: 'Personal', color: '#32a852' },
    { name: 'Important', color: '#a83232' },
    { name: 'Travel', color: '#a87d32' },
];

function Planner() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyDJ_BWFnm1A4xhTqqdQR6Ciou-Ph-QlFU8",
        libraries: ["places"],
    });

    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [newEvent, setNewEvent] = useState({
        title: '',
        start: new Date(),
        end: new Date(),
        description: '',
        location: '',
        category: '',
        tags: [],
        color: '#3174ad'
    });
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(event.category);
            const tagMatch = selectedTags.length === 0 || event.tags.some(tag => selectedTags.includes(tag));
            const searchMatch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase());
            return categoryMatch && tagMatch && searchMatch;
        });
    }, [events, selectedCategories, selectedTags, searchTerm]);

    const handleSelectSlot = useCallback((slotInfo) => {
        setNewEvent({
            title: '',
            start: slotInfo.start,
            end: slotInfo.end,
            description: '',
            location: '',
            category: '',
            tags: [],
            color: '#3174ad'
        });
        setIsEditing(false);
        setShowModal(true);
    }, []);

    const handleEventAdd = useCallback((e) => {
        e.preventDefault();
        if (isEditing) {
            setEvents(events => events.map(event =>
                event.id === selectedEvent.id ? { ...newEvent, id: selectedEvent.id } : event
            ));
        } else {
            setEvents(events => [...events, { ...newEvent, id: Date.now() }]);
        }
        setShowModal(false);
        setNewEvent({
            title: '',
            start: new Date(),
            end: new Date(),
            description: '',
            location: '',
            category: '',
            tags: [],
            color: '#3174ad'
        });
        setSelectedEvent(null);
        setIsEditing(false);
    }, [isEditing, newEvent, selectedEvent]);

    const handleSelectEvent = useCallback((event) => {
        setSelectedEvent(event);
        setNewEvent(event);
        setIsEditing(true);
        setShowModal(true);
    }, []);

    const handleDeleteEvent = useCallback(() => {
        setEvents(events => events.filter(event => event.id !== selectedEvent.id));
        setShowModal(false);
        setSelectedEvent(null);
        setIsEditing(false);
    }, [selectedEvent]);

    const EventComponent = useCallback(({ event }) => (
        <div style={{borderLeft: `4px solid ${event.color}`}} className="p-1">
            <strong>{event.title}</strong>
            {event.location && <div><small>{event.location}</small></div>}
            {event.tags.length > 0 && (
                <div className="flex flex-wrap mt-1">
                    {event.tags.map(tag => (
                        <span key={tag} className="bg-gray-200 text-xs rounded-full px-2 py-1 mr-1 mb-1">{tag}</span>
                    ))}
                </div>
            )}
        </div>
    ), []);

    const moveEvent = useCallback(({ event, start, end }) => {
        setEvents(events => {
            const idx = events.indexOf(event);
            const updatedEvent = { ...event, start, end };
            const nextEvents = [...events];
            nextEvents.splice(idx, 1, updatedEvent);
            return nextEvents;
        });
    }, []);

    const toggleCategory = useCallback((category) => {
        setSelectedCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    }, []);

    const toggleTag = useCallback((tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`bg-white shadow-lg transition-all duration-300 ${showSidebar ? 'w-64' : 'w-16'}`}>
                <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="w-full p-4 text-left hover:bg-gray-100"
                >
                    {showSidebar ? <XMarkIcon className="h-6 w-6"/> : <AdjustmentsHorizontalIcon className="h-6 w-6"/>}
                </button>
                {showSidebar && (
                    <div className="p-4">
                        <h3 className="text-lg font-semibold mb-4">Categories</h3>
                        {categories.map(category => (
                            <div key={category.name} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id={`category-${category.name}`}
                                    checked={selectedCategories.includes(category.name)}
                                    onChange={() => toggleCategory(category.name)}
                                    className="mr-2"
                                />
                                <label htmlFor={`category-${category.name}`} className="flex items-center">
                                    <div className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: category.color}}></div>
                                    {category.name}
                                </label>
                            </div>
                        ))}
                        <button
                            onClick={() => setShowFilterModal(true)}
                            className="mt-4 w-full bg-blue-500 text-white rounded-md py-2 flex items-center justify-center"
                        >
                            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2"/>
                            Advanced Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Main content */}
            <div className="flex-1 p-8">
                <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Planner</h2>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div style={{height: 'calc(100vh - 280px)'}}>
                        <Calendar
                            components={{ event: EventComponent }}
                            localizer={localizer}
                            events={filteredEvents}
                            startAccessor="start"
                            endAccessor="end"
                            defaultView="month"
                            views={['month', 'week', 'day', 'agenda']}
                            style={{height: '100%'}}
                            onSelectSlot={handleSelectSlot}
                            selectable
                            className="rounded-lg shadow-inner"
                            onSelectEvent={handleSelectEvent}
                            onEventDrop={moveEvent}
                            resizable
                            onEventResize={moveEvent}
                            eventPropGetter={(event) => ({
                                style: { backgroundColor: event.color },
                            })}
                            popup
                            showMultiDayTimes
                            step={60}
                            timeslots={1}
                        />
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{scale: 0.8}}
                            animate={{scale: 1}}
                            exit={{scale: 0.8}}
                            className="bg-white rounded-lg p-8 w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold">{isEditing ? 'Edit Event' : 'Add New Event'}</h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                                    <XMarkIcon className="h-6 w-6"/>
                                </button>
                            </div>
                            <form onSubmit={handleEventAdd} className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                                        <input
                                            type="date"
                                            id="startDate"
                                            name="startDate"
                                            value={newEvent.start.toISOString().split('T')[0]}
                                            onChange={(e) => {
                                                const date = new Date(e.target.value);
                                                const currentTime = newEvent.start;
                                                date.setHours(currentTime.getHours(), currentTime.getMinutes());
                                                setNewEvent({...newEvent, start: date});
                                            }}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                                        <input
                                            type="time"
                                            id="startTime"
                                            name="startTime"
                                            value={newEvent.start.toTimeString().slice(0, 5)}
                                            onChange={(e) => {
                                                const [hours, minutes] = e.target.value.split(':');
                                                const newDate = new Date(newEvent.start);
                                                newDate.setHours(hours, minutes);
                                                setNewEvent({...newEvent, start: newDate});
                                            }}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                                        <input
                                            type="date"
                                            id="endDate"
                                            name="endDate"
                                            value={newEvent.end.toISOString().split('T')[0]}
                                            onChange={(e) => {
                                                const date = new Date(e.target.value);
                                                const currentTime = newEvent.end;
                                                date.setHours(currentTime.getHours(), currentTime.getMinutes());
                                                setNewEvent({...newEvent, end: date});
                                            }}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                                        <input
                                            type="time"
                                            id="endTime"
                                            name="endTime"
                                            value={newEvent.end.toTimeString().slice(0, 5)}
                                            onChange={(e) => {
                                                const [hours, minutes] = e.target.value.split(':');
                                                const newDate = new Date(newEvent.end);
                                                newDate.setHours(hours, minutes);
                                                setNewEvent({...newEvent, end: newDate});
                                            }}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={newEvent.description}
                                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                                        rows="3"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    ></textarea>
                                </div>

                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                                    {isLoaded ? (
                                        <AddressInput
                                            value={newEvent.location}
                                            onChange={(value) => setNewEvent({...newEvent, location: value})}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={newEvent.location}
                                            onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        value={newEvent.category}
                                        onChange={(e) => {
                                            const selectedCategory = categories.find(cat => cat.name === e.target.value);
                                            setNewEvent({
                                                ...newEvent,
                                                category: e.target.value,
                                                color: selectedCategory ? selectedCategory.color : '#3174ad'
                                            });
                                        }}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(cat => (
                                            <option key={cat.name} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tags</label>
                                    <input
                                        type="text"
                                        value={newEvent.tags.join(', ')}
                                        onChange={(e) => setNewEvent({
                                            ...newEvent,
                                            tags: e.target.value.split(',').map(tag => tag.trim())
                                        })}
                                        placeholder="Enter tags separated by commas"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                </div>

                                <div className="flex justify-end space-x-2">
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={handleDeleteEvent}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            <TrashIcon className="h-5 w-5 mr-2"/>
                                            Delete
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <PencilIcon className="h-5 w-5 mr-2"/>
                                        {isEditing ? 'Update' : 'Add'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Event button */}
            <button
                onClick={() => {
                    setNewEvent({
                        title: '',
                        start: new Date(),
                        end: new Date(),
                        description: '',
                        location: '',
                        category: '',
                        tags: [],
                        color: '#3174ad'
                    });
                    setIsEditing(false);
                    setShowModal(true);
                }}
                className="fixed bottom-8 right-8 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-colors"
            >
                <PlusIcon className="h-6 w-6"/>
            </button>
        </div>
    );
}

export default Planner;