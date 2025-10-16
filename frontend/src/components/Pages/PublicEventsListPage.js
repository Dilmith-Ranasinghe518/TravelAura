import React, { useEffect, useMemo, useState } from 'react';
import EventService from "../services/event.service";
import EventCard from "../Events/EventCard";
//import coverImg from '../assets/cover1.png'; 
import EventTrendingStripe from "../Events/EventTrendingStripe";
import Header from "../Header/header";
import Fotter from "../Fotter/fotter";



export default function PublicEventsListPage({ coverImage }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtering & pagination state
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    let cancelled = false;

    const normalizeRespToArray = (resp) => {
      if (!resp) return [];
      if (Array.isArray(resp)) return resp;
      if (Array.isArray(resp.data)) return resp.data;
      if (resp.success && Array.isArray(resp.data)) return resp.data;
      return [];
    };

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await EventService.getAllEvents?.(false) || await EventService.getAllEvents?.();
        let eventsArr = normalizeRespToArray(res);

        const hasPublicTrending = eventsArr.some(e => e && e.is_trending && (e.status || '').toLowerCase() === 'published');

        if (!hasPublicTrending) {
          try {
            const adminRes = await EventService.getAllEvents?.(true);
            const adminArr = normalizeRespToArray(adminRes);
            if (adminArr.length > 0) {
              eventsArr = adminArr;
              console.debug('[Events] fallback to admin fetch: got', adminArr.length, 'events');
            }
          } catch (admErr) {
            console.warn('Admin fetch failed (ignored):', admErr);
          }
        }

        if (!cancelled) {
          setEvents(eventsArr);
          console.debug('[Events] loaded', eventsArr.length, 'events; trending among them:',
            eventsArr.filter(e => e && e.is_trending).length);
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Failed to load events');
        console.error('Failed to load events:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const publishedEventsBase = useMemo(
    () => events.filter(e => (e.status || '').toLowerCase() === 'published'),
    [events]
  );

  // const cover1 = 'https://via.placeholder.com/1200x400?text=Cover';
  // const coverImg = cover1;

  const categories = useMemo(() => {
    const freq = {};
    publishedEventsBase.forEach(e => { if (e.category) freq[e.category] = (freq[e.category] || 0) + 1; });
    const sorted = Object.keys(freq).sort((a, b) => (freq[b] - freq[a]));
    return ['all', ...sorted];
  }, [publishedEventsBase]);

  const trendingEvents = useMemo(() => publishedEventsBase.filter(e => e.is_trending), [publishedEventsBase]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return publishedEventsBase.filter(e => {
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        (e.title || '').toLowerCase().includes(q) ||
        (e.description || '').toLowerCase().includes(q) ||
        (e.tags || []).join(' ').toLowerCase().includes(q)
      );
    });
  }, [publishedEventsBase, categoryFilter, searchQuery]);

  // split into events vs festivals
  const eventsOnly = filtered.filter(e => (e.type || 'event') === 'event');
  const festivalsOnly = filtered.filter(e => (e.type || 'event') === 'festival');

  // pagination helpers for combined listing
  const totalPagesEvents = Math.max(1, Math.ceil(eventsOnly.length / itemsPerPage));
  const totalPagesFestivals = Math.max(1, Math.ceil(festivalsOnly.length / itemsPerPage));

  // show page-scoped slices
  const pagedEvents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return eventsOnly.slice(start, start + itemsPerPage);
  }, [eventsOnly, currentPage]);

  const pagedFestivals = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return festivalsOnly.slice(start, start + itemsPerPage);
  }, [festivalsOnly, currentPage]);

  const resetPagination = () => setCurrentPage(1);

  return (
    <div className="min-h-screen bg-white">

      <Header />
      {/*<Header />*/}

      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="h-72 md:h-[500px] w-full overflow-hidden bg-gradient-to-br from-sky-500 via-teal-500 to-amber-600 relative">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl"></div>
          
         <img
            src={"https://thehiddensrilanka.com/wp-content/uploads/2024/07/perahara-1024x381.jpg"}
            alt="Explore events"
            className="w-full h-full object-cover object-center mix-blend-overlay"
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-8 py-8 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl max-w-4xl mx-4">
            <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 bg-amber-500/20 backdrop-blur-sm rounded-full border border-amber-300/30">
              <svg className="w-5 h-5 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              <span className="text-amber-200 font-semibold text-sm">Discover Amazing</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
              <span className="bg-gradient-to-r from-white via-sky-100 to-teal-200 bg-clip-text text-white">
                Event & Festival Explorer
              </span>
            </h1>
            <p className="text-lg md:text-lg text-white/90 mb-6 font-medium leading-relaxed max-w-2xl mx-auto">
              Explore Sri Lanka’s vibrant festivals, timeless traditions, and once-in-a-lifetime cultural experiences - from sacred processions to coastal celebrations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="text-white font-medium">Sri Lanka</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white font-medium">Real-time Updates</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 bg-sky-50">
        {/* Trending Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full border border-amber-200 mb-4">
              <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              <span className="text-amber-800 font-bold text-sm">HOT PICKS</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              <span className="text-amber-600">Trending</span>{" "}
              <span className="text-gray-900">Highlights</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The most popular events everyone's talking about right now
            </p>
          </div>
          <EventTrendingStripe items={trendingEvents} onCardClick={() => {}} />
        </section>

        {/* Search & Filter Section */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-md border border-sky-200 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 rounded-full border border-teal-200 mb-4">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-teal-800 font-bold text-sm">SMART SEARCH</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                <span className="text-gray-900">Find</span>{" "}
                <span className="text-teal-500">Perfect</span>
              </h2>
              <p className="text-gray-600">Filter and search through hundreds of amazing events</p>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); resetPagination(); }}
                    placeholder="Search events, tags, descriptions..."
                    className="w-full pl-12 pr-4 py-4 bg-sky-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 text-gray-900 placeholder-gray-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                  <span className="inline-flex items-center gap-2">
                    <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                    </svg>
                    Filter by category
                  </span>
                </div>
                <CategoryChips
                  categories={categories}
                  active={categoryFilter}
                  onChange={(c) => { setCategoryFilter(c); resetPagination(); }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="mb-16">
          <SectionHeading
            badge="LIVE EVENTS"
            title="Event"
            highlight="Showcase"
            subtitle="Immerse yourself in cultural celebrations and community gatherings"
            icon="🎭"
            highlightColor="blue-600"
          />
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{eventsOnly.length}</span>
              </div>
              <span className="text-gray-600 font-medium">events available</span>
            </div>
            {eventsOnly.length > 0 && (
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPagesEvents}
              </div>
            )}
          </div>

          {loading ? (
            <LoadingState message="Discovering amazing events..." />
          ) : eventsOnly.length === 0 ? (
            <EmptyState 
              icon="🎪"
              title="No Events Found"
              message="Try adjusting your search or filters to discover more events"
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {pagedEvents.map(ev => (
                  <EventCard key={ev._id} event={ev} />
                ))}
              </div>

              <div className="mt-12 flex justify-center">
                <Pagination
                  current={currentPage}
                  totalPages={totalPagesEvents}
                  onPageChange={(p) => setCurrentPage(p)}
                />
              </div>
            </>
          )}
        </section>

        {/* Festivals Section */}
        <section className="mb-16">
          <SectionHeading
            badge="CELEBRATION TIME"
            title="Festival"
            highlight="Collection"
            subtitle="Experience vibrant traditions and spectacular cultural festivals"
            icon="🎊"
            highlightColor="teal-500"
          />
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{festivalsOnly.length}</span>
              </div>
              <span className="text-gray-600 font-medium">festivals available</span>
            </div>
            {festivalsOnly.length > 0 && (
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPagesFestivals}
              </div>
            )}
          </div>
     
          {loading ? (
            <LoadingState message="Loading festival celebrations..." />
          ) : festivalsOnly.length === 0 ? (
            <EmptyState 
              icon="🎪"
              title="No Festivals Found" 
              message="Explore our events section or adjust your search criteria"
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {pagedFestivals.map(ev => (
                  <EventCard key={ev._id} event={ev} />
                ))}
              </div>

              <div className="mt-12 flex justify-center">
                <Pagination
                  current={currentPage}
                  totalPages={totalPagesFestivals}
                  onPageChange={(p) => setCurrentPage(p)}
                />
              </div>
            </>
          )}
        </section>
      </main>
    
    <Fotter />
    </div>
  );
}

/** CategoryChips with Theme Colors */
export function CategoryChips({ categories = [], active = 'all', onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => onChange?.(c)}
          className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-all duration-300 transform hover:scale-105 ${
            active === c
              ? 'bg-sky-500 hover:bg-sky-600 text-white border-sky-500 shadow-md'
              : 'bg-white text-teal-600 border-teal-500 hover:bg-teal-50 hover:shadow-md'
          }`}
        >
          {c === 'all' ? 'All Categories' : c}
        </button>
      ))}
    </div>
  );
}

/** Pagination with Theme Colors */
export function Pagination({ current = 1, totalPages = 1, onPageChange }) {
  const pages = [];
  const maxButtons = 5;
  let start = Math.max(1, current - Math.floor(maxButtons / 2));
  let end = Math.min(totalPages, start + maxButtons - 1);
  if (end - start < maxButtons - 1) start = Math.max(1, end - maxButtons + 1);

  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <nav className="inline-flex items-center gap-3 bg-white p-2 rounded-xl shadow-md border border-sky-200">
      <button 
        onClick={() => onPageChange(Math.max(1, current - 1))} 
        disabled={current === 1}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-sky-50 border border-sky-200 rounded-xl hover:bg-sky-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>
      
      {start > 1 && <span className="px-2 text-gray-400">...</span>}
      
      {pages.map(p => (
        <button 
          key={p} 
          onClick={() => onPageChange(p)} 
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${
            p === current 
              ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-md transform scale-105' 
              : 'text-gray-700 hover:bg-sky-50 hover:text-sky-700'
          }`}
        >
          {p}
        </button>
      ))}
      
      {end < totalPages && <span className="px-2 text-gray-400">...</span>}
      
      <button 
        onClick={() => onPageChange(Math.min(totalPages, current + 1))} 
        disabled={current === totalPages}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-sky-50 border border-sky-200 rounded-xl hover:bg-sky-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        Next
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}

/** EmptyState with Theme Colors */
function EmptyState({ icon = '📅', title = 'Nothing Here', message = 'No items found' }) {
  return (
    <div className="text-center py-16 bg-white rounded-xl shadow-md border border-sky-200">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-sky-100 rounded-3xl mb-6">
        <span className="text-4xl">{icon}</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">{message}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
          Reset Filters
        </button>
        <button className="px-6 py-3 bg-white text-teal-600 font-semibold border-2 border-teal-500 rounded-xl hover:bg-teal-50 transition-all duration-300">
          Browse All Events
        </button>
      </div>
    </div>
  );
}

/** LoadingState with Theme Colors */
function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="text-center py-16 bg-white rounded-xl shadow-md border border-sky-200">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-2xl mb-6">
        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{message}</h3>
      <p className="text-gray-600">This won't take long...</p>
    </div>
  );
}

export function SectionHeading({ badge, title, highlight, subtitle, icon, highlightColor = "amber-600" }) {
  const colorClasses = {
    "amber-600": "text-amber-600",
    "blue-600": "text-blue-600", 
    "green-600": "text-green-600",
    "orange-600": "text-orange-600",
    "teal-500": "text-teal-500"
  };

  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 rounded-full border border-sky-200 mb-4">
        {icon && <span className="text-lg">{icon}</span>}
        <span className="text-sky-800 font-bold text-sm">{badge}</span>
      </div>
      <h2 className="text-3xl md:text-5xl font-black mb-4">
        <span className="text-gray-900">{title} </span>
        <span className={colorClasses[highlightColor] || "text-amber-600"}>{highlight}</span>
      </h2>
      {subtitle && (
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
      )}
     
    </div>
  );
}