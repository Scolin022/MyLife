import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { PlusIcon } from '@heroicons/react/24/solid';

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
    console.log('Rendering Planner component');
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        start: new Date(),
        end: new Date(),
    });

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
        setEvents([...events, newEvent]);
        setShowModal(false);
        setNewEvent({ title: '', start: new Date(), end: new Date() });
    };

    return (
        <div className="h-full p-8 bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Planner</h2>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{height: 'calc(100% - 80px)'}}
                    onSelectSlot={handleSelectSlot}
                    selectable
                    className="rounded-lg shadow-inner"
                />
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 w-96">
                        <h3 className="text-2xl font-bold mb-4">Add New Event</h3>
                        <form onSubmit={handleEventAdd}>
                            <input
                                type="text"
                                placeholder="Event Title"
                                value={newEvent.title}
                                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                                className="w-full p-2 mb-4 border rounded"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Add Event
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