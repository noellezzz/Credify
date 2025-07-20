import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicEvents, setFilters, clearError } from '../features/events/eventsSlice';
import {
    selectFilteredPublicEvents,
    selectEventsLoading,
    selectEventsError,
    selectUpcomingEvents
} from '../features/events/eventsSelector';
import { formatErrorMessage, getErrorType, getErrorIcon, getErrorColorClass } from '../utils/errorHandler';
import {
    FiCalendar,
    FiMapPin,
    FiUser,
    FiClock,
    FiSearch,
    FiFilter,
    FiX,
    FiCheckCircle,
    FiEye
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const PublicEventsPage = () => {
    const dispatch = useDispatch();
    const events = useSelector(selectFilteredPublicEvents);
    const loading = useSelector(selectEventsLoading);
    const error = useSelector(selectEventsError);
    const upcomingEvents = useSelector(selectUpcomingEvents);

    const [searchTerm, setSearchTerm] = useState('');
    const [eventTypeFilter, setEventTypeFilter] = useState('all');
    const [dateRangeFilter, setDateRangeFilter] = useState('all');

    const errorType = getErrorType(error);
    const errorMessage = formatErrorMessage(error);
    const errorIcon = getErrorIcon(errorType);
    const errorColorClass = getErrorColorClass(errorType);

    useEffect(() => {
        dispatch(fetchPublicEvents());
    }, [dispatch]);

    useEffect(() => {
        dispatch(setFilters({
            search: searchTerm,
            eventType: eventTypeFilter,
            dateRange: dateRangeFilter
        }));
    }, [searchTerm, eventTypeFilter, dateRangeFilter, dispatch]);

    const getEventTypeColor = (type) => {
        switch (type) {
            case 'graduation':
                return 'bg-blue-100 text-blue-800';
            case 'certification':
                return 'bg-green-100 text-green-800';
            case 'award':
                return 'bg-purple-100 text-purple-800';
            case 'workshop':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const isEventUpcoming = (eventDate) => {
        return new Date(eventDate) >= new Date();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading events...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        School Events
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover graduation ceremonies, certification programs, awards, and workshops 
                        from verified educational institutions.
                    </p>
                </div>

                {/* Error Display */}
                {error && (
                    <div className={`mb-6 p-4 rounded-lg border ${errorColorClass} flex items-center justify-between`}>
                        <div className="flex items-center">
                            {errorIcon}
                            <span className="ml-2 font-medium">{errorMessage}</span>
                        </div>
                        <button 
                            onClick={() => dispatch(clearError())}
                            className="text-current opacity-75 hover:opacity-100"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <FiCalendar className="w-8 h-8 text-blue-500 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Total Events</p>
                                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <FiClock className="w-8 h-8 text-green-500 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Upcoming Events</p>
                                <p className="text-2xl font-bold text-gray-900">{upcomingEvents.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <FiCheckCircle className="w-8 h-8 text-purple-500 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Verification Available</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {events.filter(e => e.requires_verification).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search events, schools, or descriptions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <select
                                value={eventTypeFilter}
                                onChange={(e) => setEventTypeFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Types</option>
                                <option value="graduation">Graduation</option>
                                <option value="certification">Certification</option>
                                <option value="award">Award</option>
                                <option value="workshop">Workshop</option>
                            </select>
                            <select
                                value={dateRangeFilter}
                                onChange={(e) => setDateRangeFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Dates</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="this_month">This Month</option>
                                <option value="this_year">This Year</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Events Grid */}
                {events.length === 0 ? (
                    <div className="text-center py-12">
                        <FiCalendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <div key={event.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    {/* Event Type Badge */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(event.event_type)}`}>
                                            {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                                        </span>
                                        {event.requires_verification && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                                                <FiCheckCircle className="w-3 h-3" />
                                                Verification Available
                                            </span>
                                        )}
                                    </div>

                                    {/* Event Title */}
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {event.title}
                                    </h3>

                                    {/* School Info */}
                                    <div className="flex items-center text-gray-600 mb-3">
                                        <FiUser className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{event.schools?.name}</span>
                                    </div>

                                    {/* Event Date */}
                                    <div className="flex items-center text-gray-600 mb-3">
                                        <FiCalendar className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{formatDate(event.event_date)}</span>
                                        {isEventUpcoming(event.event_date) && (
                                            <span className="ml-2 inline-flex items-center px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                                                Upcoming
                                            </span>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {event.description}
                                    </p>

                                    {/* Action Button */}
                                    <Link
                                        to={`/events/${event.id}`}
                                        className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <FiEye className="w-4 h-4" />
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicEventsPage;
