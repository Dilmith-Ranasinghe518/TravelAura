import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Heart } from 'lucide-react';
import EventService from '../services/event.service';

function formatDate(d) {
  if (!d) return 'TBA';
  try {
    const date = new Date(d);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const day = date.getDate().toString().padStart(2,'0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return d;
  }
}

const FireIcon = ({ className = '' }) => (
  <svg className={`w-3 h-3 ${className}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden>
    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
  </svg>
);

const TrendingBadge = () => (
  <div className="absolute -top-2 -right-2 z-10">
    <div className="bg-amber-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white">
      <FireIcon />
    </div>
  </div>
);

export default function EventTrendingStripe({ items = null, limit = 10, onCardClick = null }) {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [events, setEvents] = React.useState(Array.isArray(items) ? items : []);
  const [localState, setLocalState] = React.useState({});

  React.useEffect(() => {
    let mounted = true;

    const initFromProp = () => {
      if (Array.isArray(items)) {
        setEvents(items);
        const s = {};
        items.filter(it => it && it.is_trending).forEach(it => {
          s[it._id] = {
            likesCount: Number(it.likes_count || 0),
            viewsCount: Number(it.views_count || 0),
            isLiked: EventService.isLocallyLiked(it._id),
            likePending: false
          };
        });
        setLocalState(s);
      }
    };

    if (Array.isArray(items)) {
      initFromProp();
      return () => { mounted = false; };
    }

    (async () => {
      setLoading(true);
      setError('');
      try {
        const resp = await EventService.getTrendingEvents(limit);
        let arr = [];
        if (!resp) arr = [];
        else if (Array.isArray(resp)) arr = resp;
        else if (Array.isArray(resp.data)) arr = resp.data;
        else if (resp.success && Array.isArray(resp.data)) arr = resp.data;
        else arr = [];

        if (!mounted) return;
        setEvents(arr);

        const s = {};
        arr.filter(it => it && it.is_trending).forEach(it => {
          s[it._id] = {
            likesCount: Number(it.likes_count || 0),
            viewsCount: Number(it.views_count || 0),
            isLiked: EventService.isLocallyLiked(it._id),
            likePending: false
          };
        });
        setLocalState(s);
      } catch (err) {
        console.error('Failed to load trending events', err);
        if (!mounted) return;
        setError(err.message || 'Failed to load trending events');
        setEvents([]);
        setLocalState({});
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [items, limit]);

  React.useEffect(() => {
    if (!Array.isArray(items) && events.length > 0) {
      setLocalState(prev => {
        const copy = { ...(prev || {}) };
        events.forEach(it => {
          if (!copy[it._id]) {
            copy[it._id] = {
              likesCount: Number(it.likes_count || 0),
              viewsCount: Number(it.views_count || 0),
              isLiked: EventService.isLocallyLiked(it._id),
              likePending: false
            };
          }
        });
        return copy;
      });
    }
  }, [events, items]);

  const trending = (events || []).filter(it => it && it.is_trending);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl">
        <div className="text-center text-gray-500">Loading trending events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-6 bg-red-50 rounded-xl">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  if (!trending || trending.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500 bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="font-medium">No trending events available</p>
        </div>
      </div>
    );
  }

  const toggleLike = async (evt, eventObj) => {
    evt.stopPropagation();
    const id = eventObj._id;
    if (!id) return;

    const prevState = localState[id] || {
      likesCount: Number(eventObj.likes_count || 0),
      isLiked: EventService.isLocallyLiked(id)
    };

    setLocalState(prev => ({
      ...prev,
      [id]: { ...(prev[id] || {}), likePending: true, isLiked: !prevState.isLiked, likesCount: (prevState.isLiked ? Math.max(0, prevState.likesCount - 1) : prevState.likesCount + 1) }
    }));

    try {
      const resp = !prevState.isLiked ? await EventService.likeEvent(id) : await EventService.unlikeEvent(id);
      const inner = resp && resp.data ? resp.data : (resp && resp.success && resp.data ? resp.data : null);
      const serverLikes = inner?.likes_count ?? inner?.likesCount ?? null;

      setLocalState(prev => ({
        ...prev,
        [id]: {
          ...(prev[id] || {}),
          isLiked: EventService.isLocallyLiked(id),
          likesCount: serverLikes != null ? Number(serverLikes) : (prev[id]?.likesCount ?? prevState.likesCount),
          likePending: false
        }
      }));
    } catch (err) {
      console.error('Like toggle failed', err);
      setLocalState(prev => ({
        ...prev,
        [id]: { ...(prev[id] || {}), isLiked: prevState.isLiked, likesCount: prevState.likesCount, likePending: false }
      }));
    }
  };

  const viewAndNavigate = (e, it) => {
    e.stopPropagation();
    const id = it._id;

    // Navigate helper: call onCardClick (if provided) and navigate unless the callback returns false
    const go = () => {
      try {
        if (typeof onCardClick === 'function') {
          // if callback explicitly returns false, block navigation
          const maybe = onCardClick(it);
          if (maybe === false) return;
        }
      } catch (err) {
        console.warn('onCardClick threw:', err);
        // continue to navigate even if callback errors
      }
      navigate(`/events/${it.slug}`);
    };

    if (!id) {
      go();
      return;
    }

    EventService.incrementView(id)
      .then(resp => {
        const inner = resp && resp.data ? resp.data : (resp && resp.success && resp.data ? resp.data : null);
        const serverViews = inner?.views_count ?? inner?.viewsCount ?? null;
        if (serverViews != null) {
          setLocalState(prev => ({
            ...prev,
            [id]: {
              ...(prev[id] || {}),
              viewsCount: Number(serverViews)
            }
          }));
        }
      })
      .catch(err => {
        console.warn('incrementView failed', err);
      })
      .finally(() => {
        go();
      });
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto py-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-sky-300 scrollbar-track-sky-100">
        <div className="flex gap-6 w-max pb-2">
          {trending.map((it) => {
            const state = localState[it._id] || {};
            const likes = state.likesCount ?? Number(it.likes_count ?? 0);
            const views = state.viewsCount ?? Number(it.views_count ?? 0);
            const isLiked = typeof state.isLiked === 'boolean' ? state.isLiked : EventService.isLocallyLiked(it._id);
            const likePending = !!state.likePending;

            return (
              <div
                key={it._id}
                tabIndex={0}
                className={`group relative min-w-[280px] bg-white border-2 rounded-xl overflow-hidden shadow-lg transition-all duration-300 cursor-pointer border-sky-200 hover:border-sky-400`}
                onClick={() => (typeof onCardClick === 'function' ? onCardClick(it) : navigate(`/events/${it.slug}`))}
                onKeyDown={(e) => { if (e.key === 'Enter') (typeof onCardClick === 'function' ? onCardClick(it) : navigate(`/events/${it.slug}`)); }}
              >
                {it.is_trending && <TrendingBadge />}

                <div className="relative h-28 w-full overflow-hidden bg-gradient-to-br from-sky-100 to-blue-100">
                  {it.image_links?.[0] ? (
                    <img src={it.image_links[0]} alt={it.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-8 h-8 mx-auto mb-1 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V10H3v9a2 2 0 0 0 2 2z" />
                          </svg>
                        </div>
                        <p className="text-xs text-sky-600 font-medium">Event</p>
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-bold px-2 py-1 rounded-lg shadow-md border border-sky-200">
                    {it.start_date ? formatDate(it.start_date).split(' ').slice(0,2).join(' ') : 'TBA'}
                  </div>
                </div>

                <div className="p-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-2">{it.title}</h4>
                    {it.category && (
                      <span className="flex-shrink-0 text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full font-medium border border-sky-200">
                        {it.category}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Eye size={14} />
                        <span>{views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Heart size={14} />
                        <span>{likes.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleLike(e, it)}
                        disabled={likePending}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-500'} ${likePending ? 'opacity-70 cursor-wait' : ''}`}
                        aria-pressed={isLiked}
                      >
                        <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                        <span className="text-xs">{isLiked ? 'Liked' : 'Like'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-2">
                    {it.location ? <span className="truncate">{it.location}</span> : <span>Location TBA</span>}
                  </div>

                  <div>
                    <button
                      onClick={(e) => { e.stopPropagation(); viewAndNavigate(e, it); }}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg font-semibold text-sm shadow-sm hover:shadow-md transition-transform duration-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
