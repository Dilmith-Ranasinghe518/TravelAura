import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import EventService from '../services/event.service';

function formatDate(d) {
  if (!d) return 'TBA';
  try {
    const date = new Date(d);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const day = date.getDate().toString().padStart(2,'0');
    const month = months[date.getMonth()];
    return `${day} ${month} ${date.getFullYear()}`;
  } catch { return d; }
}

const FireIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
  </svg>
);

export default function EventCard({ event, onClick }) {
  const navigate = useNavigate();
  const [viewsCount, setViewsCount] = useState(Number(event?.views_count || 0));
  const [likesCount, setLikesCount] = useState(Number(event?.likes_count || 0));
  const [isLiked, setIsLiked] = useState(() => EventService.isLocallyLiked(event?._id));
  const [likePending, setLikePending] = useState(false);
  const [viewPending, setViewPending] = useState(false);
  const viewTimerRef = useRef(null);

  useEffect(() => {
    setViewsCount(Number(event?.views_count || 0));
    setLikesCount(Number(event?.likes_count || 0));
    setIsLiked(EventService.isLocallyLiked(event?._id));
  }, [event]);

  const handleLikeToggle = async (e) => {
    e.stopPropagation();
    if (!event?._id || likePending) return;
    const prevLiked = isLiked;
    const prevLikes = likesCount;
    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevLikes - 1) : prevLikes + 1);
    setLikePending(true);
    try {
      let resp;
      if (!prevLiked) resp = await EventService.likeEvent(event._id);
      else resp = await EventService.unlikeEvent(event._id);

      const serverData = resp?.data;
      if (serverData?.likes_count != null) setLikesCount(Number(serverData.likes_count));
      EventService._setLocalLikedFlag(event._id, !prevLiked);
    } catch (err) {
      setIsLiked(prevLiked);
      setLikesCount(prevLikes);
      console.error('Like API error', err);
    } finally {
      setLikePending(false);
    }
  };

  const handleViewAndNavigate = (e) => {
    if (e) e.stopPropagation();

    if (!event?._id || viewPending) {
      navigate(`/events/${event.slug}`);
      return;
    }

    setViewPending(true);

    EventService.incrementView(event._id)
      .then((resp) => {
        if (resp?.data?.views_count != null) {
          setViewsCount(Number(resp.data.views_count));
        }
      })
      .catch((err) => {
        console.warn('incrementView failed', err);
      })
      .finally(() => {
        clearTimeout(viewTimerRef.current);
        viewTimerRef.current = setTimeout(() => setViewPending(false), 800);
      });

    navigate(`/events/${event.slug}`);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Music: 'bg-blue-600 text-white',
      Food: 'bg-green-600 text-white',
      Sports: 'bg-teal-500 text-white',
      Religious: 'bg-orange-600 text-white',
      Cultural: 'bg-amber-600 text-white',
      Community: 'bg-purple-600 text-white',
      Nature: 'bg-pink-600 text-white',
      default: 'bg-gray-600 text-white'
    };
    return colors[category] || colors.default;
  };

  return (
    <article
      className="relative bg-white border-2 border-sky-200 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-sky-500/30 hover:scale-105 hover:shadow-xl hover:border-sky-500 cursor-pointer"
      onClick={() => navigate(`/events/${event.slug}`)}
    >
      <div className="relative h-36 w-full bg-gradient-to-br from-sky-50 to-sky-100">
        {event.image_links && event.image_links.length > 0 ? (
          <img src={event.image_links[0]} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-sky-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V10H3v9a2 2 0 0 0 2 2z" />
                </svg>
              </div>
              <p className="text-sky-600 text-sm font-medium">Event Image</p>
            </div>
          </div>
        )}

        {event.category && (
          <div className={`absolute top-2 left-2 ${getCategoryColor(event.category)} text-xs font-semibold px-2 py-1 rounded-full shadow-lg`}>
            {event.category}
          </div>
        )}

        {event.is_trending && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
            <FireIcon />
            <span>Hot</span>
          </div>
        )}

        {event.start_date && (
          <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-bold px-2 py-1 rounded-lg shadow-md">
            {formatDate(event.start_date).split(' ')[0]} {formatDate(event.start_date).split(' ')[1]}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">{event.title}</h3>

          <div className="flex flex-col items-end gap-2">
            {/* Like button */}
            <button
              onClick={handleLikeToggle}
              disabled={likePending}
              aria-pressed={isLiked}
              className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all text-sm ${isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-500'} ${likePending ? 'opacity-70 cursor-wait' : ''}`}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" aria-hidden>
                <path d="M12 21s-8-7.4-8-11.6C4 6 6.5 4 9 4c1.5 0 2.5.9 3 1.6C12.5 4.9 13.5 4 15 4c2.5 0 5 2 5 5.4C20 13.6 12 21 12 21z" />
              </svg>
              <span className="text-xs">{likesCount.toLocaleString()}</span>
            </button>

            {/* Views - READ-ONLY label using Eye icon */}
            <div className="text-xs text-gray-500 flex items-center gap-2 select-none" aria-hidden>
              <Eye size={14} />
              <span>{viewsCount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mb-3 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 0 0 2-2V10H3v9a2 2 0 0 0 2 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">{formatDate(event.start_date)}</span>
          </div>

          {event.location && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22s8-4.5 8-10a8 8 0 10-16 0c0 5.5 8 10 8 10z" />
                </svg>
              </div>
              <span className="text-sm text-gray-600 truncate">{event.location}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleViewAndNavigate(e); }}
            disabled={viewPending}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}
