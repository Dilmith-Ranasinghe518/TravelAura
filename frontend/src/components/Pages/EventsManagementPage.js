import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import EventService from "../services/event.service";
import EventForm from "../Events/EventForm";
import { 
    FaFire, 
    FaFireAlt, 
    FaCalendarAlt, 
    FaMusic, 
    FaFilter, 
    FaTimes, 
    FaSearch,
    FaMapMarkerAlt,
    FaSort,
    FaExclamationTriangle
} from 'react-icons/fa';

// Custom Confirm Alert Component
const CustomConfirmAlert = ({ isOpen, title, message, onConfirm, onCancel, type = 'danger' }) => {
    if (!isOpen) return null;

    const typeStyles = {
        danger: {
            icon: <FaExclamationTriangle className="w-6 h-6 text-red-500" />,
            confirmBg: 'bg-red-500 hover:bg-red-600',
            border: 'border-red-200'
        },
        warning: {
            icon: <FaExclamationTriangle className="w-6 h-6 text-amber-500" />,
            confirmBg: 'bg-amber-500 hover:bg-amber-600',
            border: 'border-amber-200'
        }
    };

    const currentStyle = typeStyles[type] || typeStyles.danger;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className={`bg-white rounded-xl shadow-2xl max-w-md w-full border-2 ${currentStyle.border} transform transition-all duration-300 scale-100`}>
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        {currentStyle.icon}
                        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-4 py-2 ${currentStyle.confirmBg} text-white rounded-lg transition-colors font-medium`}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EventManagementPage = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [editingEvent, setEditingEvent] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [confirmAlert, setConfirmAlert] = useState({ isOpen: false, event: null });
    
    // Filter states
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        type: '',
        location: '',
        trending: '',
        dateRange: 'all'
    });

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 4;

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [events, viewMode, filters]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await EventService.getAllEvents(true);
            setEvents(response.data || []);
        } catch (error) {
            toast.error(error.message || 'Failed to fetch events');
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...events];

        // Status filter
        if (viewMode !== 'all') {
            filtered = filtered.filter(event => event.status?.toLowerCase() === viewMode);
        }

        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(event => 
                event.title?.toLowerCase().includes(searchTerm) ||
                event.description?.toLowerCase().includes(searchTerm)
            );
        }

        // Category filter
        if (filters.category) {
            filtered = filtered.filter(event => event.category === filters.category);
        }

        // Type filter
        if (filters.type) {
            filtered = filtered.filter(event => event.type === filters.type);
        }

        // Location filter
        if (filters.location) {
            const locationTerm = filters.location.toLowerCase();
            filtered = filtered.filter(event => 
                event.location?.toLowerCase().includes(locationTerm)
            );
        }

        // Trending filter
        if (filters.trending) {
            const isTrending = filters.trending === 'trending';
            filtered = filtered.filter(event => event.is_trending === isTrending);
        }

        // Date range filter
        if (filters.dateRange !== 'all') {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            
            filtered = filtered.filter(event => {
                if (!event.start_date) return false;
                const eventDate = new Date(event.start_date);
                
                switch (filters.dateRange) {
                    case 'upcoming':
                        return eventDate >= today;
                    case 'past':
                        return eventDate < today;
                    case 'thisMonth':
                        return eventDate.getMonth() === now.getMonth() && 
                               eventDate.getFullYear() === now.getFullYear();
                    default:
                        return true;
                }
            });
        }

        setFilteredEvents(filtered);
        setCurrentPage(0);
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            category: '',
            type: '',
            location: '',
            trending: '',
            dateRange: 'all'
        });
    };

    const handleCreateNew = () => {
        setEditingEvent(null);
        setIsFormOpen(true);
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (eventData) => {
        const operation = editingEvent
            ? EventService.updateEvent(editingEvent._id, eventData)
            : EventService.createEvent(eventData);

        toast.promise(
            operation,
            {
                pending: editingEvent ? 'Updating event...' : 'Creating event...',
                success: editingEvent ? 'Event updated successfully' : 'Event created successfully',
                error: 'Operation failed',
            }
        );

        try {
            await operation;
            setIsFormOpen(false);
            setEditingEvent(null);
            fetchEvents();
        } catch (error) {
            console.error(error);
        }
    };

    const handleStatusChange = async (eventId, newStatus) => {
        try {
            await EventService.updateEventStatus(eventId, newStatus);
            toast.success(`Event ${newStatus} successfully`);
            fetchEvents();
        } catch (error) {
            toast.error(error.message || 'Failed to update status');
        }
    };

    const handleTrendingToggle = async (eventId, currentTrending) => {
        try {
            await EventService.updateEventTrending(eventId, !currentTrending);
            toast.success(`Event ${!currentTrending ? 'marked as trending' : 'removed from trending'}`);
            fetchEvents();
        } catch (error) {
            toast.error(error.message || 'Failed to update trending status');
        }
    };

    const handleDelete = (event) => {
        setConfirmAlert({
            isOpen: true,
            event: event
        });
    };

    const confirmDelete = async () => {
        try {
            await EventService.deleteEvent(confirmAlert.event._id);
            toast.success('Event deleted successfully');
            fetchEvents();
            setConfirmAlert({ isOpen: false, event: null });
        } catch (error) {
            toast.error(error.message || 'Failed to delete event');
            setConfirmAlert({ isOpen: false, event: null });
        }
    };

    const cancelDelete = () => {
        setConfirmAlert({ isOpen: false, event: null });
    };

    const offset = currentPage * itemsPerPage;
    const currentEvents = filteredEvents.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(filteredEvents.length / itemsPerPage);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'published':
                return 'bg-green-100 text-green-800';
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            case 'archived':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const renderStatusBadge = (status) => {
        const colorClasses = getStatusColor(status);
        return (
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold ${colorClasses} rounded-full`}>
                {status || 'N/A'}
            </span>
        );
    };

    const renderTypeBadge = (type) => {
        const typeValue = type?.toLowerCase() || 'event';
        
        if (typeValue === 'festival') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200">
                    <FaMusic className="w-3 h-3" />
                    Festival
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                    <FaCalendarAlt className="w-3 h-3" />
                    Event
                </span>
            );
        }
    };

    // Get unique values for filter options
    const getUniqueCategories = () => {
        const categories = events.map(event => event.category).filter(Boolean);
        return [...new Set(categories)];
    };

    const getUniqueTypes = () => {
        const types = events.map(event => event.type).filter(Boolean);
        return [...new Set(types)];
    };

    const getUniqueLocations = () => {
        const locations = events.map(event => event.location).filter(Boolean);
        return [...new Set(locations)];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-md border border-sky-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-amber-600 to-teal-500 bg-clip-text text-transparent">
                                Event Management
                            </h1>
                            <p className="text-gray-600 mt-2">Manage and organize your events efficiently</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                    showFilters 
                                        ? 'bg-teal-500 text-white hover:bg-teal-600' 
                                        : 'bg-white border-2 border-teal-500 text-teal-600 hover:bg-teal-50'
                                }`}
                            >
                                <FaFilter className="w-4 h-4" />
                                Filters
                            </button>

                            <button
                                onClick={handleCreateNew}
                                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                Create New Event
                            </button>
                        </div>
                    </div>

                    {/* Status Filter Tabs */}
                    <div className="mt-6 flex flex-wrap gap-2">
                        {[ 
                            { key: 'all', label: 'All Events', count: events.length, color: 'bg-sky-500 hover:bg-sky-600' },
                            { key: 'published', label: 'Published', count: events.filter(e => e.status === 'published').length, color: 'bg-green-500 hover:bg-green-600' },
                            { key: 'draft', label: 'Draft', count: events.filter(e => e.status === 'draft').length, color: 'bg-gray-500 hover:bg-gray-600' },
                            { key: 'archived', label: 'Archived', count: events.filter(e => e.status === 'archived').length, color: 'bg-orange-500 hover:bg-orange-600' }
                        ].map(({ key, label, count, color }) => (
                            <button
                                key={key}
                                onClick={() => setViewMode(key)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                                    viewMode === key
                                        ? `${color} text-white shadow-md transform scale-105`
                                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-sky-50 hover:border-sky-300'
                                }`}
                            >
                                {label} <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${viewMode === key ? 'bg-white bg-opacity-20' : 'bg-gray-100'}`}>
                                    {count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Advanced Filter Panel */}
                {showFilters && (
                    <div className="bg-white rounded-xl shadow-md border border-sky-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-blue-600 flex items-center gap-2">
                                <FaSort className="w-4 h-4" />
                                Advanced Filters
                            </h3>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {/* Search */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search events..."
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                >
                                    <option value="">All Categories</option>
                                    {getUniqueCategories().map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                <select
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                >
                                    <option value="">All Types</option>
                                    {getUniqueTypes().map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                <div className="relative">
                                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Filter by location..."
                                        value={filters.location}
                                        onChange={(e) => handleFilterChange('location', e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Trending */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Trending</label>
                                <select
                                    value={filters.trending}
                                    onChange={(e) => handleFilterChange('trending', e.target.value)}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                >
                                    <option value="">All Events</option>
                                    <option value="trending">Trending Only</option>
                                    <option value="not-trending">Non-Trending</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={clearFilters}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                )}

                {/* Event Form Modal */}
                {isFormOpen && (
                    <EventForm
                        event={editingEvent}
                        onSubmit={handleFormSubmit}
                        onClose={() => setIsFormOpen(false)}
                    />
                )}

                {/* Custom Confirm Alert */}
                <CustomConfirmAlert
                    isOpen={confirmAlert.isOpen}
                    title="Delete Event"
                    message={`Are you sure you want to delete "${confirmAlert.event?.title}"? This action cannot be undone.`}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                    type="danger"
                />

                {/* Results Summary */}
                {!loading && (
                    <div className="bg-gradient-to-r from-teal-50 to-sky-50 rounded-xl border border-teal-200 p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-bold text-teal-600">{currentEvents.length}</span> of{' '}
                                <span className="font-bold text-teal-600">{filteredEvents.length}</span> events
                                {viewMode !== 'all' && (
                                    <span className="ml-1">({viewMode})</span>
                                )}
                            </div>
                            {Object.values(filters).some(filter => filter !== '' && filter !== 'all') && (
                                <div className="text-sm text-orange-600 font-medium">
                                    Filters applied
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Table Container */}
                <div className="bg-white rounded-xl shadow-md border border-sky-200 overflow-hidden">
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-500 mx-auto"></div>
                            <p className="mt-6 text-gray-600 text-lg">Loading Events...</p>
                        </div>
                    ) : (
                        <>
                            {filteredEvents.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="text-8xl mb-6">📅</div>
                                    <h3 className="text-2xl font-bold text-gray-600 mb-3">No Events Found</h3>
                                    <p className="text-gray-500 text-lg">
                                        {viewMode === 'all' 
                                            ? 'Create your first event to get started!' 
                                            : `No ${viewMode} events match your criteria.`}
                                    </p>
                                    {Object.values(filters).some(filter => filter !== '' && filter !== 'all') && (
                                        <button
                                            onClick={clearFilters}
                                            className="mt-4 bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            Clear Filters
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-sky-100">
                                        <thead className="bg-gradient-to-r from-sky-50 to-teal-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Event</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">Dates</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell">Location</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell">Type</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Trending</th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody className="bg-white divide-y divide-sky-100">
                                            {currentEvents.map((event, idx) => (
                                                <tr
                                                    key={event._id}
                                                    className={`${idx % 2 === 0 ? 'bg-white' : 'bg-sky-50'} align-top hover:bg-sky-100 transition-colors duration-200`}
                                                >
                                                    <td className="px-4 py-4 max-w-xs">
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 border border-sky-100">
                                                                {event.image_links && event.image_links.length > 0 ? (
                                                                    <img src={event.image_links[0]} alt={event.title} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="text-sm font-semibold text-gray-900 line-clamp-2">{event.title}</div>
                                                                <div className="text-xs text-gray-600 mt-1">{event.description ? `${event.description.slice(0, 80)}${event.description.length > 80 ? '...' : ''}` : ''}</div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-4 text-sm text-gray-600 hidden md:table-cell">
                                                        <div> {formatDate(event.start_date)} </div>
                                                        <div className="text-xs text-gray-500 mt-1">{formatDate(event.end_date)}</div>
                                                    </td>

                                                    <td className="px-4 py-4 text-sm text-gray-600 hidden lg:table-cell">
                                                        {event.location || '—'}
                                                    </td>

                                                    <td className="px-4 py-4 text-sm">
                                                        {event.category ? (
                                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-200 text-teal-800">
                                                                {event.category}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-500">—</span>
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-4 text-sm hidden lg:table-cell">
                                                        {renderTypeBadge(event.type)}
                                                    </td>

                                                    <td className="px-4 py-4 text-sm">
                                                        {renderStatusBadge(event.status)}
                                                    </td>

                                                    <td className="px-4 py-4 text-center">
                                                        <button
                                                            onClick={() => handleTrendingToggle(event._id, event.is_trending)}
                                                            className={`inline-flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition ${
                                                                event.is_trending
                                                                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                                                    : 'border border-amber-300 text-amber-600 hover:bg-amber-50'
                                                            }`}
                                                            aria-pressed={!!event.is_trending}
                                                            title={event.is_trending ? 'Remove Trending' : 'Mark as Trending'}
                                                        >
                                                            <span className="text-sm transition-transform duration-300 ease-in-out">
                                                                {event.is_trending ? <FaFire /> : <FaFireAlt />}
                                                            </span>
                                                            <span className="sr-only">Trending toggle</span>
                                                        </button>
                                                    </td>

                                                    <td className="px-4 py-4 text-right">
                                                        <div className="flex justify-end gap-2 flex-wrap">
                                                            {/* Hide Edit button for archived events */}
                                                            {event.status !== 'archived' && (
                                                                <button
                                                                    onClick={() => handleEdit(event)}
                                                                    className="px-3 py-1 text-sm rounded-md bg-sky-500 hover:bg-sky-600 text-white transition shadow-sm hover:shadow-md"
                                                                >
                                                                    Edit
                                                                </button>
                                                            )}

                                                            {/* Draft → Published */}
                                                            {event.status === 'draft' && (
                                                                <button
                                                                    onClick={() => handleStatusChange(event._id, 'published')}
                                                                    className="px-3 py-1 text-sm rounded-md bg-green-600 hover:bg-green-700 text-white transition shadow-sm hover:shadow-md"
                                                                >
                                                                    Publish
                                                                </button>
                                                            )}

                                                            {/* Published → Archived */}
                                                            {event.status === 'published' && (
                                                                <button
                                                                    onClick={() => handleStatusChange(event._id, 'archived')}
                                                                    className="px-3 py-1 text-sm rounded-md bg-orange-500 hover:bg-orange-600 text-white transition shadow-sm hover:shadow-md"
                                                                >
                                                                    Archive
                                                                </button>
                                                            )}

                                                            {/* Archived → Draft */}
                                                            {event.status === 'archived' && (
                                                                <button
                                                                    onClick={() => handleStatusChange(event._id, 'draft')}
                                                                    className="px-3 py-1 text-sm rounded-md bg-gray-600 hover:bg-gray-700 text-white transition shadow-sm hover:shadow-md"
                                                                >
                                                                    Back to Draft
                                                                </button>
                                                            )}

                                                            <button
                                                                onClick={() => handleDelete(event)}
                                                                className="px-3 py-1 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white transition shadow-sm hover:shadow-md"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {filteredEvents.length > itemsPerPage && (
                                <div className="bg-gradient-to-r from-sky-50 to-teal-50 px-6 py-4 border-t border-sky-200">
                                    <div className="flex justify-center">
                                        <ReactPaginate
                                            previousLabel={"← Previous"}
                                            nextLabel={"Next →"}
                                            breakLabel={"..."}
                                            pageCount={pageCount}
                                            marginPagesDisplayed={1}
                                            pageRangeDisplayed={2}
                                            onPageChange={handlePageClick}
                                            containerClassName={"flex items-center gap-2"}
                                            pageClassName={"px-4 py-2 border border-sky-200 rounded-lg bg-white hover:bg-sky-50 transition-colors cursor-pointer"}
                                            activeClassName={"bg-sky-500 text-black font-bold border-sky-500 hover:bg-sky-600"}
                                            previousClassName={"px-4 py-2 border border-sky-200 rounded-lg bg-white hover:bg-sky-50 transition-colors cursor-pointer"}
                                            nextClassName={"px-4 py-2 border border-sky-200 rounded-lg bg-white hover:bg-sky-50 transition-colors cursor-pointer"}
                                            disabledClassName={"opacity-50 cursor-not-allowed"}
                                            breakClassName={"px-4 py-2 text-gray-500"}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Quick Stats Footer */}
                {!loading && events.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-xl shadow-lg">
                            <div className="text-2xl font-bold">{events.filter(e => e.status === 'published').length}</div>
                            <div className="text-green-100">Published Events</div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-400 to-gray-600 text-white p-6 rounded-xl shadow-lg">
                            <div className="text-2xl font-bold">{events.filter(e => e.status === 'draft').length}</div>
                            <div className="text-gray-100">Draft Events</div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white p-6 rounded-xl shadow-lg">
                            <div className="text-2xl font-bold">{events.filter(e => e.status === 'archived').length}</div>
                            <div className="text-orange-100">Archived Events</div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-400 to-amber-600 text-white p-6 rounded-xl shadow-lg">
                            <div className="text-2xl font-bold">{events.filter(e => e.is_trending).length}</div>
                            <div className="text-amber-100">Trending Events</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventManagementPage;