import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { PlusIcon, PencilIcon, CalendarIcon, UserIcon, BriefcaseIcon, XMarkIcon, AdjustmentsHorizontalIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { useLoadScript } from '@react-google-maps/api';
import AddressInput from '../planner/AddressInput';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecurringEvents } from '../planner/hooks/useRecurringEvents';
import ConfirmationModal from './../common/ConfirmationModal.jsx';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

function Planner({ user }) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
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
        color: '#3174ad',
        isRecurring: false,
        recurringPattern: { frequency: 'weekly', interval: 1 }
    });
    const [categories, setCategories] = useState([
        { id: '1', name: 'Work', color: '#689cff' },
        { id: '2', name: 'Personal', color: '#b07cff' },
        { id: '3', name: 'Important', color: '#f84e4e' },
        { id: '4', name: 'Travel', color: '#e6ad35' },
        { id: '5', name: 'DMACC', color: '#10e62d' },
        { id: '6', name: 'TechWise', color: '#533ecf' },
    ]);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [newCategory, setNewCategory] = useState({ name: '', color: '#000000' });
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    // const [showFilterModal, setShowFilterModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    // const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const { createRecurringEvents, updateRecurringEvents } = useRecurringEvents();
    const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, eventId: null });

    const fetchEvents = useCallback(async () => {
        if (!user) return;
        const q = query(collection(db, 'events'), where("userId", "==", user.uid));
        try {
            const querySnapshot = await getDocs(q);
            const fetchedEvents = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    start: data.start ? data.start.toDate() : new Date(),
                    end: data.end ? data.end.toDate() : new Date()
                };
            });
            setEvents(fetchedEvents);
            console.log("Events fetched successfully:", fetchedEvents);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    }, [user]);
    const handleEditCategory = (categoryId) => {
        setEditingCategoryId(categoryId);
    };

    const handleSaveCategory = (categoryId) => {
        setCategories(prevCategories =>
            prevCategories.map(cat =>
                cat.id === categoryId ? {...cat, name: cat.name.trim()} : cat
            )
        );
        setEditingCategoryId(null);
    };

    const handleCategoryChange = (categoryId, field, value) => {
        setCategories(prevCategories =>
            prevCategories.map(cat =>
                cat.id === categoryId ? {...cat, [field]: value} : cat
            )
        );
    };

    const handleAddCategory = () => {
        if (newCategory.name.trim()) {
            setCategories(prevCategories => [
                ...prevCategories,
                { ...newCategory, id: Date.now().toString() }
            ]);
            setNewCategory({ name: '', color: '#000000' });
        }
    };

    const handleDeleteCategory = (categoryId) => {
        setCategories(prevCategories =>
            prevCategories.filter(cat => cat.id !== categoryId)
        );
    };

    const handleEventAdd = useCallback(async (e) => {
        e.preventDefault();
        console.log("Form submitted");

        try {
            let newEventData = {
                ...newEvent,
                userId: user.uid,
                start: newEvent.start,
                end: newEvent.end
            };
            let docRef;

            if (isEditing) {
                if (newEvent.isRecurring) {
                    await updateRecurringEvents(newEvent, new Date());
                } else {
                    docRef = doc(db, 'events', selectedEvent.id);
                    await updateDoc(docRef, newEventData);
                }
                console.log("Event updated");
            } else {
                if (newEvent.isRecurring) {
                    const recurringEvents = createRecurringEvents(newEvent);
                    for (let event of recurringEvents) {
                        docRef = await addDoc(collection(db, 'events'), { ...event, userId: user.uid });
                        console.log("New recurring event added", docRef.id);
                    }
                } else {
                    docRef = await addDoc(collection(db, 'events'), newEventData);
                    console.log("New event added", docRef.id);
                }
            }

            await fetchEvents();
            console.log("Events fetched after add/update");

            setShowModal(false);
            setNewEvent({
                title: '',
                start: new Date(),
                end: new Date(),
                description: '',
                location: '',
                category: '',
                tags: [],
                color: '#3174ad',
                isRecurring: false,
                recurringPattern: { frequency: 'weekly', interval: 1 }
            });
            setSelectedEvent(null);
            setIsEditing(false);
        } catch (error) {
            console.error("Error adding/updating event: ", error);
        }
    }, [isEditing, newEvent, selectedEvent, createRecurringEvents, updateRecurringEvents, user, fetchEvents]);


    const EventComponent = useCallback(({ event }) => (
        <div style={{borderLeft: `4px solid ${event.color}`}} className="p-1">
            <strong>{event.title}</strong>
            <div><small>{format(event.start, 'h:mm a')}</small></div>
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

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(event.category);
            const tagMatch = selectedTags.length === 0 || event.tags.some(tag => selectedTags.includes(tag));
            const searchMatch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase());
            return categoryMatch && tagMatch && searchMatch;
        });
    }, [events, selectedCategories, selectedTags, searchTerm]);

    const handleDeleteConfirmation = useCallback((event) => {
        setDeleteConfirmation({ isOpen: true, eventId: event.id });
        setShowModal(false);
    }, []);

    const handleSelectSlot = useCallback((slotInfo) => {
        setNewEvent({
            title: '',
            start: slotInfo.start,
            end: slotInfo.end,
            description: '',
            location: '',
            category: '',
            tags: [],
            color: '#3174ad',
            isRecurring: false,
            recurringPattern: { frequency: 'weekly', interval: 1 }
        });
        setIsEditing(false);
        setShowModal(true);
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);


    const handleSelectEvent = useCallback((event) => {
        setSelectedEvent(event);
        setNewEvent(event);
        setIsEditing(true);
        setShowModal(true);
    }, []);

    const handleDeleteEvent = useCallback(async () => {
        if (!deleteConfirmation.eventId || !user) return;
        try {
            await deleteDoc(doc(db, 'events', deleteConfirmation.eventId));
            await fetchEvents();  // Refresh the events list
            setSelectedEvent(null);
            setIsEditing(false);
            setShowModal(false);
        } catch (error) {
            console.error("Error deleting event: ", error);
        }
    }, [deleteConfirmation.eventId, user, fetchEvents]);

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
            {/*/!* Collapsible Sidebar *!/*/}
            {/*<div*/}
            {/*    className={`bg-gray-800 text-white transition-all duration-300 ${sidebarExpanded ? 'w-64' : 'w-16'} flex flex-col`}>*/}
            {/*    <button*/}
            {/*        onClick={() => setSidebarExpanded(!sidebarExpanded)}*/}
            {/*        className="p-4 hover:bg-gray-700 flex items-center justify-center"*/}
            {/*    >*/}
            {/*        {sidebarExpanded ? <XMarkIcon className="h-6 w-6"/> : <AdjustmentsHorizontalIcon className="h-6 w-6"/>}*/}
            {/*    </button>*/}
            {/*    <nav className="flex-1">*/}
            {/*        {[*/}
            {/*            {icon: <CalendarIcon className="h-5 w-5"/>, text: 'Planner'},*/}
            {/*            {icon: <UserIcon className="h-5 w-5"/>, text: 'Profile'},*/}
            {/*            {icon: <BriefcaseIcon className="h-5 w-5"/>, text: 'Work'},*/}
            {/*            {icon: <MapPinIcon className="h-5 w-5"/>, text: 'Travel'},*/}
            {/*        ].map((item, index) => (*/}
            {/*            <a key={index} href="#" className="flex items-center p-4 hover:bg-gray-700">*/}
            {/*                {item.icon}*/}
            {/*                {sidebarExpanded && <span className="ml-3">{item.text}</span>}*/}
            {/*            </a>*/}
            {/*        ))}*/}
            {/*    </nav>*/}
            {/*</div>*/}

            {/* Main content */}
            <div className="flex-1 p-8 overflow-hidden">
                <div className="bg-white rounded-lg shadow-lg p-6 h-full relative">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">Your Planner</h2>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            <AdjustmentsHorizontalIcon className="h-5 w-5 inline-block mr-2"/>
                            Filters
                        </button>
                    </div>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{opacity: 0, y: -20}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: -20}}
                                className="absolute top-20 right-6 bg-white p-4 rounded-lg shadow-lg z-10 w-64"
                            >
                                <h3 className="font-semibold mb-2">Categories</h3>
                                {categories.map(category => (
                                    <div key={category.id} className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            id={`category-${category.id}`}
                                            checked={selectedCategories.includes(category.name)}
                                            onChange={() => toggleCategory(category.name)}
                                            className="mr-2"
                                        />
                                        {editingCategoryId === category.id ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={category.name}
                                                    onChange={(e) => handleCategoryChange(category.id, 'name', e.target.value)}
                                                    className="mr-2 px-1 border rounded"
                                                />
                                                <input
                                                    type="color"
                                                    value={category.color}
                                                    onChange={(e) => handleCategoryChange(category.id, 'color', e.target.value)}
                                                    className="mr-2 w-6 h-6"
                                                />
                                                <button onClick={() => handleSaveCategory(category.id)} className="mr-1">
                                                    <Check size={16} />
                                                </button>
                                                <button onClick={() => setEditingCategoryId(null)}>
                                                    <X size={16} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <label htmlFor={`category-${category.id}`} className="flex items-center flex-grow">
                                                    <div className="w-3 h-3 rounded-full mr-2"
                                                         style={{backgroundColor: category.color}}></div>
                                                    {category.name}
                                                </label>
                                                <button onClick={() => handleEditCategory(category.id)} className="mr-1">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDeleteCategory(category.id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ))}
                                <div className="mt-4">
                                    <h4 className="font-semibold mb-2">Add New Category</h4>
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            value={newCategory.name}
                                            onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                                            placeholder="Category name"
                                            className="mr-2 px-2 py-1 border rounded flex-grow"
                                        />
                                        <input
                                            type="color"
                                            value={newCategory.color}
                                            onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                                            className="mr-2 w-8 h-8"
                                        />
                                        <button onClick={handleAddCategory} className="bg-blue-500 text-white px-2 py-1 rounded">
                                            <PlusIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div className="h-[calc(100%-8rem)]">
                        <Calendar
                            components={{event: EventComponent}}
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
                                style: {backgroundColor: event.color},
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
                                <h3 className="text-2xl font-bold">{isEditing ? 'Event' : 'Add New Event'}</h3>
                                <button onClick={() => setShowModal(false)}
                                        className="text-gray-500 hover:text-gray-700">
                                    <XMarkIcon className="h-6 w-6"/>
                                </button>
                            </div>
                            <form onSubmit={handleEventAdd} className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event
                                        Title</label>
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
                                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start
                                            Date</label>
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
                                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start
                                            Time</label>
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
                                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End
                                            Date</label>
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
                                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End
                                            Time</label>
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
                                    <label htmlFor="description"
                                           className="block text-sm font-medium text-gray-700">Description</label>
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
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                        <MapPinIcon className="inline h-5 w-5 mr-1"/>
                                        Location
                                    </label>
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

                                <div>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={newEvent.isRecurring}
                                            onChange={(e) => setNewEvent({...newEvent, isRecurring: e.target.checked})}
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Recurring Event</span>
                                    </label>
                                </div>

                                {newEvent.isRecurring && (
                                    <div className="space-y-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Frequency</label>
                                            <select
                                                value={newEvent.recurringPattern.frequency}
                                                onChange={(e) => setNewEvent({
                                                    ...newEvent,
                                                    recurringPattern: {
                                                        ...newEvent.recurringPattern,
                                                        frequency: e.target.value
                                                    }
                                                })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            >
                                                <option value="daily">Daily</option>
                                                <option value="weekly">Weekly</option>
                                                <option value="monthly">Monthly</option>
                                                <option value="yearly">Yearly</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Interval</label>
                                            <input
                                                type="number"
                                                value={newEvent.recurringPattern.interval}
                                                onChange={(e) => setNewEvent({
                                                    ...newEvent,
                                                    recurringPattern: {
                                                        ...newEvent.recurringPattern,
                                                        interval: parseInt(e.target.value)
                                                    }
                                                })}
                                                min="1"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end space-x-2">
                                    {isEditing && (
                                        <motion.button
                                            type="button" // Change to type="button"
                                            whileHover={{scale: 1.1}}
                                            whileTap={{scale: 0.9}}
                                            onClick={() => handleDeleteConfirmation(selectedEvent)}
                                            className="text-red-500 hover:text-red-700 p-2 rounded-md flex items-center"
                                        >
                                            <Trash2 size={18} className="mr-2"/>
                                        </motion.button>
                                    )}
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        {isEditing ? 'Update' : 'Add'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
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
                        color: '#3174ad',
                        isRecurring: false,
                        recurringPattern: {frequency: 'weekly', interval: 1}
                    });
                    setIsEditing(false);
                    setShowModal(true);
                }}
                className="fixed bottom-8 right-8 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-colors"
            >
                <PlusIcon className="h-6 w-6"/>
            </button>
            <ConfirmationModal
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({isOpen: false, eventId: null})}
                onConfirm={() => {
                    handleDeleteEvent();
                    setDeleteConfirmation({isOpen: false, eventId: null});
                }}
                title="Delete Event"
                message="Are you sure you want to delete this event? This action cannot be undone."
            />
        </div>
    );
}

export default Planner;