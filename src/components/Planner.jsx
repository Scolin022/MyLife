import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useLoadScript } from '@react-google-maps/api';
import AddressInput from './AddressInput';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

function Planner() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyDJ_BWFnm1A4xhTqqdQR6Ciou-Ph-QlFU8",
        libraries: ["places"],
    });
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        start: new Date(),
        end: new Date(),
        description: '',
        location: '',
        category: '',
        tags: [],
        color: '#3174ad' // default color
    });
    const categories = [
        { name: 'Work', color: '#3174ad' },
        { name: 'Personal', color: '#32a852' },
        { name: 'Important', color: '#a83232' },
        { name: 'Travel', color: '#a87d32' },
    ];
    const [editingEvent, setEditingEvent] = useState(null);
    const handleSelectSlot = (slotInfo) => {
        setNewEvent({
            title: '',
            start: slotInfo.start,
            end: slotInfo.end,
        });
        setShowModal(true);
    };
    const handleEventAdd = (e) => {
        e.preventDefault();
        setEvents([...events, { ...newEvent, id: Date.now() }]);
        setShowModal(false);
        setNewEvent({ title: '', start: new Date(), end: new Date(), description: '', location: '', category: '' });
    };

    const handleSelectEvent = (event) => {
        setEditingEvent(event);
        setShowModal(true);
    };


    const EventComponent = ({ event }) => (
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
    );

    const moveEvent = ({ event, start, end }) => {
        const idx = events.indexOf(event);
        const updatedEvent = { ...event, start, end };

        const nextEvents = [...events];
        nextEvents.splice(idx, 1, updatedEvent);

        setEvents(nextEvents);
    };

    const EventTooltip = ({ event }) => (
        <div className="bg-white shadow-lg rounded-lg p-4 max-w-xs">
            <h4 className="font-bold">{event.title}</h4>
            <p>{event.description}</p>
            <p>Location: {event.location}</p>
            <p>Category: {event.category}</p>
            <div>Tags: {event.tags.join(', ')}</div>
        </div>
    );

    return (
        <div className="h-full p-8 bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Planner</h2>
                <div style={{ height: 'calc(100vh - 200px)' }}>
                    <Calendar
                        components={{
                            event: EventComponent,
                            eventWrapper: (props) => (
                                <div title={props.event.title}>
                                    <div className="group relative">
                                        {props.children}
                                        <div className="absolute z-10 hidden group-hover:block">
                                            <EventTooltip event={props.event} />
                                        </div>
                                    </div>
                                </div>
                            ),
                        }}
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        defaultView="month"
                        views={['month', 'week', 'day', 'agenda']}
                        style={{ height: '100%' }}
                        onSelectSlot={handleSelectSlot}
                        selectable
                        className="rounded-lg shadow-inner"
                        onSelectEvent={handleSelectEvent}
                        onEventDrop={moveEvent}
                        resizable
                        onEventResize={moveEvent}
                        eventPropGetter={(event) => ({
                            style: {
                                backgroundColor: event.color,
                            },
                        })}
                        tooltipAccessor={null} // Disables default tooltip in favor of our custom one
                        popup
                        showMultiDayTimes
                        step={60}
                        timeslots={1}
                    />
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 w-96">
                        <h3 className="text-2xl font-bold mb-4">{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>
                        <form onSubmit={editingEvent ? handleEventEdit : handleEventAdd} className="space-y-4">
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
                                <label htmlFor="location"
                                       className="block text-sm font-medium text-gray-700">Location</label>
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
                                            color: selectedCategory.color
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
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                    {editingEvent ? 'Update Event' : 'Add Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-8 right-8 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-colors"
            >
                <PlusIcon className="h-6 w-6"/>
            </button>
        </div>
    );
}

export default Planner;