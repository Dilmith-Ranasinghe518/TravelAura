import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Tag,
  TrendingUp,
  Clock,
  Users,
  Loader2,
  Heart,
  Eye,
  MessageCircle
} from 'lucide-react';
import EventService from "../services/event.service";
import EventCard from "../Events/EventCard";

export default function EventDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // UI state for counters / like
  const [viewsCount, setViewsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likePending, setLikePending] = useState(false);

  const [showContactModal, setShowContactModal] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
  let cancelled = false;
  (async () => {
    try {
      setLoading(true);
      const res = await EventService.getEvent(slug);
      const fetchedEvent = res?.data;
      if (!fetchedEvent) throw new Error('Event not found');

      if (!cancelled) {
        setEvent(fetchedEvent);
        setViewsCount(Number(fetchedEvent.views_count || 0));
        setLikesCount(Number(fetchedEvent.likes_count || 0));
        setIsLiked(EventService.isLocallyLiked(fetchedEvent._id));
      }

      try {
        const rel = await EventService.getRelatedEvents(slug);
        if (!cancelled) setRelated(rel.data || []);
      } catch (relErr) {
        if (!cancelled) setRelated([]);
      }

    } catch (err) {
      if (!cancelled) setError(err.message || 'Not found');
    } finally {
      if (!cancelled) setLoading(false);
    }
  })();
  return () => { cancelled = true; };
}, [slug]);


  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return { status: 'upcoming', color: 'bg-green-400', text: 'Upcoming' };
    } else if (now >= start && now <= end) {
      return { status: 'ongoing', color: 'bg-yellow-400', text: 'Happening Now' };
    } else {
      return { status: 'ended', color: 'bg-gray-400', text: 'Event Ended' };
    }
  };

  const nextImage = () => {
    if (event?.image_links?.length > 0) {
      setImageLoaded(false);
      setCurrentImageIndex((prev) => (prev + 1) % event.image_links.length);
    }
  };

  const prevImage = () => {
    if (event?.image_links?.length > 0) {
      setImageLoaded(false);
      setCurrentImageIndex((prev) => (prev - 1 + event.image_links.length) % event.image_links.length);
    }
  };

  const goToSlide = (index) => {
    setImageLoaded(false);
    setCurrentImageIndex(index);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Optimistic like/unlike handler shared by both buttons
  const handleLike = async () => {
    if (!event || !event._id) return;
    if (likePending) return;

    const eventId = event._id;
    const prevLiked = isLiked;
    const prevLikes = likesCount;

    // optimistic update
    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevLikes - 1) : prevLikes + 1);
    setLikePending(true);

    try {
      let resp;
      if (!prevLiked) {
        // switching to liked
        resp = await EventService.likeEvent(eventId); // returns { success: true, data: {...} }
      } else {
        // unliking
        resp = await EventService.unlikeEvent(eventId);
      }

      // reconcile with server numbers if provided
      const serverData = resp?.data;
      if (serverData) {
        if (serverData.likes_count != null) {
          setLikesCount(Number(serverData.likes_count));
        }
        if (serverData.trending_score != null) {
          setEvent(prev => prev ? { ...prev, trending_score: serverData.trending_score, likes_count: serverData.likes_count } : prev);
        }
      }
    } catch (err) {
      // rollback optimistic UI on error
      console.error('Like API error', err);
      setIsLiked(prevLiked);
      setLikesCount(prevLikes);
      // show a user-friendly message in UI
      setError(err?.message || 'Failed to update like. Please try again.');
      // clear error after a short while (optional)
      setTimeout(() => setError(''), 4000);
    } finally {
      setLikePending(false);
    }
  };

  const handleContactAgent = () => {
    setShowContactModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-sky-500 mx-auto mb-4" size={48} />
          <p className="text-xl text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠</span>
          </div>
          <p className="text-xl text-red-600">{error}</p>
          <button
            onClick={() => navigate('/events')}
            className="mt-4 px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-500 text-2xl">?</span>
          </div>
          <p className="text-xl text-gray-600">Event not found</p>
          <button
            onClick={() => navigate('/events')}
            className="mt-4 px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const images = event.image_links || [];
  const hasImages = images.length > 0;
  const eventStatus = getEventStatus(event.start_date, event.end_date);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-sky-500 via-teal-500 to-amber-600 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center gap-2 text-white hover:text-sky-100 transition-colors"
          >
            <ChevronLeft size={24} />
            <span className="text-lg">Back to Events</span>
          </button>

          <h1 className="text-2xl lg:text-4xl font-bold text-white text-center flex-1">
            {event.title}
          </h1>

          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">

            {/* Image Gallery */}
            <div className="relative mb-6">
              <div className="relative h-96 lg:h-[450px] overflow-hidden rounded-xl border-4 border-sky-200">
                {hasImages ? (
                  <>
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Event image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onLoad={() => setImageLoaded(true)}
                        />
                      </div>
                    ))}

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 rounded-full shadow-lg transition-all duration-300"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 rounded-full shadow-lg transition-all duration-300"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}

                    {/* Slide Indicators */}
                    {images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              index === currentImageIndex
                                ? 'bg-white'
                                : 'bg-white/40 hover:bg-white/60'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Calendar size={64} className="mx-auto mb-4 opacity-50" />
                      <p className="text-xl opacity-75">Event Image</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex ? 'border-sky-500' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Event Description */}
            <div className="bg-sky-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 leading-relaxed text-lg">
                {event.description}
              </p>
            </div>
          </div>

          {/* Sidebar - Event Details */}
          <div className="space-y-6">
            {/* Stats Bar */}
            <div className="bg-white rounded-xl shadow-md p-4 border border-sky-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye size={18} />
                  <span className="text-sm">{viewsCount.toLocaleString()} views</span>
                </div>
                <button
                  onClick={handleLike}
                  disabled={likePending}
                  aria-pressed={isLiked}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all ${
                    isLiked
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                  } ${likePending ? 'opacity-70 cursor-wait' : ''}`}
                >
                  <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                  <span className="text-sm">{likesCount.toLocaleString()}</span>
                </button>
              </div>
            </div>

            {/* Event Details Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-sky-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Event Details</h2>

              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Status:</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${eventStatus.color}`} />
                    <span className="text-sm font-medium text-gray-700">{eventStatus.text}</span>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <Calendar size={18} />
                    <span className="font-semibold">Start Date</span>
                  </div>
                  <p className="text-gray-700 ml-6">{formatDate(event.start_date)}</p>
                  <p className="text-gray-500 text-sm ml-6">{formatTime(event.start_date)}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Calendar size={18} />
                    <span className="font-semibold">End Date</span>
                  </div>
                  <p className="text-gray-700 ml-6">{formatDate(event.end_date)}</p>
                  <p className="text-gray-500 text-sm ml-6">{formatTime(event.end_date)}</p>
                </div>

                {/* Location */}
                <div>
                  <div className="flex items-center gap-2 text-orange-600 mb-2">
                    <MapPin size={18} />
                    <span className="font-semibold">Location</span>
                  </div>
                  <p className="text-gray-700 ml-6">{event.location || 'TBA'}</p>
                </div>

                {/* Category */}
                <div>
                  <div className="flex items-center gap-2 text-amber-600 mb-2">
                    <Tag size={18} />
                    <span className="font-semibold">Category</span>
                  </div>
                  <p className="text-gray-700 ml-6">{event.category || 'Uncategorized'} • {event.type}</p>
                </div>

                {/* Trending Badge */}
                {event.is_trending && (
                  <div className="flex items-center justify-center gap-2 bg-amber-100 text-amber-700 py-2 px-4 rounded-lg">
                    <TrendingUp size={18} />
                    <span className="font-semibold">Trending Event</span>
                  </div>
                )}

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div>
                    <span className="text-gray-600 font-medium">Tags:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {event.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleLike}
                  disabled={likePending}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    isLiked
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-sky-500 hover:bg-sky-600 text-white'
                  } ${likePending ? 'opacity-80 cursor-wait' : ''}`}
                >
                  <Heart size={18} className="inline mr-2" fill={isLiked ? 'currentColor' : 'none'} />
                  {likePending ? (isLiked ? 'Liking...' : 'Updating...') : (isLiked ? 'Liked!' : 'Like Event')}
                </button>

                <button
                  onClick={handleContactAgent}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
                >
                  <MessageCircle size={18} className="inline mr-2" />
                  Contact Agent
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Events */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Related Events
          </h2>

          {related.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">No related events found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(ev => (
                <Link key={ev._id} to={`/events/${ev.slug}`} className="group">
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <EventCard event={ev} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Agent Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Agent</h3>
            <div className="text-center py-8">
              <MessageCircle className="mx-auto text-sky-500 mb-4" size={64} />
              <p className="text-gray-600 text-lg mb-6">Coming Soon!</p>
              <p className="text-gray-500">We're working on implementing the contact agent feature.</p>
            </div>
            <button
              onClick={() => setShowContactModal(false)}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
