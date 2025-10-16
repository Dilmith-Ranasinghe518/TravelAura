import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);


export class EventService {
  
  static async getAllEvents(admin = false) {
    try {
      const response = await api.get(`/events${admin ? '?admin=true' : ''}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch events');
    }
  }

  static async getPublishedEvents() {
    return this.getAllEvents(false);
  }

  static async getEvent(identifier) {
    try {
      const response = await api.get(`/events/${identifier}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch event');
    }
  }

  static async getRelatedEvents(identifier) {
    try {
      const response = await api.get(`/events/${identifier}/related`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch related events');
    }
  }

  static async createEvent(eventData) {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create event');
    }
  }

  static async updateEvent(id, updateData) {
    try {
      const response = await api.put(`/events/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update event');
    }
  }

  static async updateEventStatus(id, status) {
    try {
      const response = await api.patch(`/events/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update event status');
    }
  }

  static async updateEventTrending(id, isTrending) {
    try {
      const response = await api.patch(`/events/${id}/trending`, { is_trending: isTrending });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update event trending status');
    }
  }

  static async deleteEvent(id) {
    try {
      const response = await api.delete(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete event');
    }
  }

  static validateRequiredFields(eventData) {
    return !!(eventData.title && eventData.start_date && eventData.end_date);
  }

  static validateStatus(status) {
    return ['draft', 'published', 'archived'].includes(status);
  }

  static validateDates(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return false;
    }
    
    return start < end;
  }

  static formatEventData(eventData) {
    return {
      ...eventData,
      start_date: eventData.start_date ? new Date(eventData.start_date).toISOString() : undefined,
      end_date: eventData.end_date ? new Date(eventData.end_date).toISOString() : undefined,
    };
  }

  static async incrementView(id) {
    try {
      const response = await api.post(`/events/${id}/view`);
      return response.data; 
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to increment view');
    }
  }

  static async recordViewIfNotSeen(id, minIntervalMinutes = 30) {
    try {
      if (!id) throw new Error('Event id required');

      const key = `viewed_event_${id}`;
      const now = Date.now();
      const stored = sessionStorage.getItem(key);
      if (stored) {
        const ts = Number(stored);
        const elapsedMin = (now - ts) / (1000 * 60);
        if (elapsedMin < minIntervalMinutes) {
          return { sent: false, reason: 'recently recorded in this session' };
        }
      }

      sessionStorage.setItem(key, String(now));

      const resp = await this.incrementView(id);
      sessionStorage.setItem(key, String(Date.now()));
      return { sent: true, response: resp };
    } catch (error) {
      try { sessionStorage.removeItem(`viewed_event_${id}`); } catch (e) {}
      throw error;
    }
  }


  static async likeEvent(id) {
    try {
      const response = await api.post(`/events/${id}/like`);
      this._setLocalLikedFlag(id, true);
      return response.data; 
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to like event');
    }
  }

  static async unlikeEvent(id) {
    try {
      const response = await api.post(`/events/${id}/unlike`);
      this._setLocalLikedFlag(id, false);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to unlike event');
    }
  }


  static async toggleLikeOptimistic(id, shouldLike) {
    if (shouldLike) {
      return this.likeEvent(id);
    } else {
      return this.unlikeEvent(id);
    }
  }


  static async recomputeEventTrending(id) {
    try {
      const response = await api.patch(`/events/${id}/trending`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to recompute event trending');
    }
  }

  static async recomputeGlobalTrending(topN = 10) {
    try {
      const response = await api.patch('/events/trending/recompute', { topN });
      return response.data; 
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to recompute global trending');
    }
  }


  static _setLocalLikedFlag(id, liked = true) {
    try {
      const key = 'liked_events_local';
      const raw = localStorage.getItem(key);
      const map = raw ? JSON.parse(raw) : {};
      map[id] = liked ? true : false;
      localStorage.setItem(key, JSON.stringify(map));
    } catch (err) {
      // ignore storage errors
    }
  }

  static isLocallyLiked(id) {
    try {
      const raw = localStorage.getItem('liked_events_local');
      const map = raw ? JSON.parse(raw) : {};
      return !!map[id];
    } catch (err) {
      return false;
    }
  }


  static clearLocalLiked(id) {
    try {
      const key = 'liked_events_local';
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const map = JSON.parse(raw);
      delete map[id];
      localStorage.setItem(key, JSON.stringify(map));
    } catch (err) {}
  }

  static async getTrendingEvents(limit = 10, { useAdmin = false } = {}) {
    try {
      const url = `/events${useAdmin ? '?admin=true' : ''}`;
      const response = await api.get(url);
      const wrapper = response.data;
      const events = (wrapper && wrapper.data) ? wrapper.data : []; 
      const trending = events
        .filter(e => e && e.is_trending && e.status === 'published')
        .sort((a, b) => (b.trending_score || 0) - (a.trending_score || 0))
        .slice(0, limit);
      return { success: true, data: trending };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch trending events');
    }
  }
}

export default EventService;
