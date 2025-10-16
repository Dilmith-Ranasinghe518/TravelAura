import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import EventService from '../services/event.service';

const EventForm = ({ event = null, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(getEmptyForm());
  const [newTag, setNewTag] = useState('');
  const [newImageLink, setNewImageLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [slugEdited, setSlugEdited] = useState(false);
  const firstInputRef = useRef(null);
  const overlayRef = useRef(null);

  // focus first input shortly after open
  useEffect(() => {
    setTimeout(() => firstInputRef.current?.focus(), 50);
  }, []);

  // Sync incoming event prop into the form (handles edit mode)
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        slug: event.slug || '',
        description: event.description || '',
        start_date: event.start_date ? new Date(event.start_date).toISOString().slice(0, 16) : '',
        end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : '',
        type: event.type || 'event',
        status: event.status || 'draft',
        category: event.category || '',
        tags: event.tags ? [...event.tags] : [],
        image_links: event.image_links ? [...event.image_links] : [],
        location: event.location || '',
        is_trending: !!event.is_trending
      });
      setSlugEdited(Boolean(event.slug)); // if slug already present, assume edited/preserved
      setErrors({});
    } else {
      setFormData(getEmptyForm());
      setSlugEdited(false);
      setErrors({});
    }
  }, [event]);

  // helper to create an empty form object
  function getEmptyForm() {
    return {
      title: '',
      slug: '',
      description: '',
      start_date: '',
      end_date: '',
      type: 'event',
      status: 'draft',
      category: '',
      tags: [],
      image_links: [],
      location: '',
      is_trending: false
    };
  }

  // Utility: auto-generate slug for new events unless user manually edited slug
  useEffect(() => {
    if (!slugEdited && !event) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.title, slugEdited, event]);

  // Validation: compute field-level errors (used on submit and can be used onBlur)
  const validateAll = (overrides = null) => {
    const fd = overrides || formData;
    const newErrors = {};

    if (!fd.title || !fd.title.trim()) newErrors.title = 'Event title is required';
    else if (fd.title.trim().length > 200) newErrors.title = 'Title must be 200 characters or less';

    if (!fd.slug || !fd.slug.trim()) newErrors.slug = 'Slug is required';
    else if (!/^[a-z0-9-]+$/.test(fd.slug)) newErrors.slug = 'Slug must be lowercase letters, numbers and hyphens only';

    if (!fd.start_date) newErrors.start_date = 'Start date is required';
    if (!fd.end_date) newErrors.end_date = 'End date is required';

    if (fd.start_date && fd.end_date && !EventService.validateDates(fd.start_date, fd.end_date)) {
      newErrors.start_date = 'Start must be before end date';
      newErrors.end_date = 'End must be after start date';
    }

    if (fd.category && fd.category.length > 100) newErrors.category = 'Category must be 100 characters or less';
    if (fd.location && fd.location.length > 200) newErrors.location = 'Location must be 200 characters or less';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate a single field on blur/change for immediate feedback
  const validateField = (name, value) => {
    let message = '';
    switch (name) {
      case 'title':
        if (!value.trim()) message = 'Event title is required';
        else if (value.trim().length > 200) message = 'Title must be 200 characters or less';
        break;
      case 'slug':
        if (!value.trim()) message = 'Slug is required';
        else if (!/^[a-z0-9-]+$/.test(value)) message = 'Slug must be lowercase letters, numbers and hyphens only';
        break;
      case 'start_date':
        if (!value) message = 'Start date is required';
        else if (formData.end_date && !EventService.validateDates(value, formData.end_date)) message = 'Start must be before end date';
        break;
      case 'end_date':
        if (!value) message = 'End date is required';
        else if (formData.start_date && !EventService.validateDates(formData.start_date, value)) message = 'End must be after start date';
        break;
      case 'location':
        if (value && value.length > 200) message = 'Location must be 200 characters or less';
        break;
      default:
        message = '';
    }
    setErrors(prev => ({ ...prev, [name]: message }));
    return message === '';
  };

  // Generic change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const final = type === 'checkbox' ? checked : value;

    // If user manually edits slug, mark slugEdited true
    if (name === 'slug') setSlugEdited(true);

    setFormData(prev => ({ ...prev, [name]: final }));
  };

  // Tags
  const handleAddTag = () => {
    const tag = newTag.trim();
    if (!tag) return;
    if (tag.length > 50) {
      setErrors(prev => ({ ...prev, tags: 'Tag must be 50 characters or less' }));
      return;
    }
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setNewTag('');
      setErrors(prev => ({ ...prev, tags: '' }));
    } else {
      setErrors(prev => ({ ...prev, tags: 'Tag already added' }));
    }
  };
  const handleRemoveTag = (t) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(x => x !== t) }));
  };

  // Image links
  const handleAddImageLink = () => {
    const link = newImageLink.trim();
    if (!link) return;
    if (!/^https?:\/\/.+/.test(link)) {
      setErrors(prev => ({ ...prev, image_links: 'Please enter a valid URL (http/https)' }));
      return;
    }
    if (!formData.image_links.includes(link)) {
      setFormData(prev => ({ ...prev, image_links: [...prev.image_links, link] }));
      setNewImageLink('');
      setErrors(prev => ({ ...prev, image_links: '' }));
    } else {
      setErrors(prev => ({ ...prev, image_links: 'Image link already added' }));
    }
  };
  const handleRemoveImageLink = (link) => {
    setFormData(prev => ({ ...prev, image_links: prev.image_links.filter(l => l !== link) }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = validateAll();
    if (!ok) {
      toast.error('Please fix validation errors before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const trimmedData = {
        ...formData,
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: (formData.description || '').trim(),
        category: formData.category.trim(),
        location: formData.location.trim(),
        tags: formData.tags.filter(Boolean),
        image_links: formData.image_links.filter(Boolean)
      };

      const formatted = EventService.formatEventData(trimmedData);
      await onSubmit(formatted);

      // close modal after successful submit
      onClose?.();
    } catch (err) {
      toast.error(err?.message || 'Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close when clicking overlay background
  const onOverlayClick = (e) => {
    if (e.target === overlayRef.current && !isSubmitting) {
      onClose?.();
    }
  };

  // Simple helper to know if form is currently valid (re-run validations without setting state)
  const isFormCurrentlyValid = () => {
    const fd = formData;
    if (!fd.title || !fd.title.trim()) return false;
    if (!fd.slug || !/^[a-z0-9-]+$/.test(fd.slug)) return false;
    if (!fd.start_date || !fd.end_date) return false;
    if (!EventService.validateDates(fd.start_date, fd.end_date)) return false;
    if (fd.category && fd.category.length > 100) return false;
    if (fd.location && fd.location.length > 200) return false;
    return true;
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-start justify-center p-6"
      style={{ background: 'rgba(240, 249, 255, 0.85)' }}
      onMouseDown={onOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-none border border-sky-200 shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-sky-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">{event ? 'Edit Event' : 'Create New Event'}</h2>
              <p className="mt-1 text-sm text-gray-600">Fill in required fields and save your event.</p>
            </div>

            <div>
              <button
                onClick={() => !isSubmitting && onClose?.()}
                className="text-2xl font-bold text-gray-400 hover:text-gray-600"
                aria-label="Close"
                disabled={isSubmitting}
              >
                x
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
          {/* Title + Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Event Title *</label>
              <input
                ref={firstInputRef}
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={(e) => validateField('title', e.target.value)}
                className="w-full px-4 py-3 border border-sky-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Enter event title"
                maxLength={200}
                aria-invalid={!!errors.title}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Slug *</label>
              <input
                name="slug"
                value={formData.slug}
                onChange={(e) => { handleChange(e); setSlugEdited(true); }}
                onBlur={(e) => validateField('slug', e.target.value)}
                className="w-full px-4 py-3 border border-sky-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="url-friendly-slug"
                maxLength={200}
                aria-invalid={!!errors.slug}
              />
              <p className="text-xs text-gray-500 mt-1">URL-friendly identifier (lowercase, numbers, hyphens)</p>
              {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              maxLength={2000}
              className="w-full px-4 py-3 border border-sky-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Describe the event..."
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Start Date & Time *</label>
              <input
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                onBlur={(e) => validateField('start_date', e.target.value)}
                type="datetime-local"
                className="w-full px-4 py-3 border border-sky-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                aria-invalid={!!errors.start_date}
              />
              {errors.start_date && <p className="mt-1 text-sm text-red-500">{errors.start_date}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">End Date & Time *</label>
              <input
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                onBlur={(e) => validateField('end_date', e.target.value)}
                type="datetime-local"
                className="w-full px-4 py-3 border border-sky-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                aria-invalid={!!errors.end_date}
              />
              {errors.end_date && <p className="mt-1 text-sm text-red-500">{errors.end_date}</p>}
            </div>
          </div>

          {/* Type / Status / Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 border border-sky-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent">
                <option value="event">Event</option>
                <option value="festival">Festival</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 border border-sky-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-sky-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                    <option value="">Select a category</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Religious">Religious</option>
                    <option value="Music">Music</option>
                    <option value="Food">Food</option>
                    <option value="Sports">Sports</option>
                    <option value="Community">Community</option>
                    <option value="Nature">Nature</option>
                    <option value="Other">Other</option>
                </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              onBlur={(e) => validateField('location', e.target.value)}
              maxLength={200}
              className="w-full px-4 py-3 border border-sky-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Event address or location"
            />
            {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Tags</label>
            <div className="flex gap-2 mb-3">
              <input
                value={newTag}
                onChange={(e) => { setNewTag(e.target.value); setErrors(prev => ({ ...prev, tags: '' })); }}
                onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                className="flex-1 px-4 py-2 border border-sky-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Add a tag"
                maxLength={50}
              />
              <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white">Add</button>
            </div>
            {errors.tags && <p className="mt-1 text-sm text-red-500">{errors.tags}</p>}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((t, i) => (
                  <span key={i} className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100 text-sky-800 text-sm">
                    #{t}
                    <button type="button" onClick={() => handleRemoveTag(t)} className="text-sky-700 font-bold">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Image Links */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Image Links</label>
            <div className="flex gap-2 mb-3">
              <input
                value={newImageLink}
                onChange={(e) => { setNewImageLink(e.target.value); setErrors(prev => ({ ...prev, image_links: '' })); }}
                onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageLink(); } }}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-2 border border-sky-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
              <button type="button" onClick={handleAddImageLink} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white">Add</button>
            </div>
            {errors.image_links && <p className="mt-1 text-sm text-red-500">{errors.image_links}</p>}
            {formData.image_links.length > 0 && (
              <div className="space-y-2">
                {formData.image_links.map((link, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-sky-50">
                    <img src={link} alt={`preview-${idx}`} className="w-16 h-16 object-cover" onError={(ev) => { ev.currentTarget.style.display = 'none'; }} />
                    <span className="flex-1 text-sm text-gray-700 truncate">{link}</span>
                    <button type="button" onClick={() => handleRemoveImageLink(link)} className="text-red-600">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trending Toggle */}
          <div className="flex items-center gap-3">
            <ToggleSwitch
              checked={formData.is_trending}
              onChange={(val) => setFormData(prev => ({ ...prev, is_trending: val }))}
            />
            <div>
              <label className="text-sm font-medium text-gray-900 inline-flex items-center gap-2">
                <span className="text-amber-500">🔥</span>
                Mark as trending
              </label>
              <p className="text-xs text-gray-500">Highlight on homepage/trending lists</p>
            </div>
          </div>

          {/* Footer actions */}
          <div className="sticky bottom-0 bg-white pt-6 border-t border-sky-100 flex justify-end gap-3">
            <button type="button" onClick={() => !isSubmitting && onClose?.()} disabled={isSubmitting} className="px-6 py-3 border border-sky-100 hover:bg-sky-50">Cancel</button>

            <button
              type="submit"
              disabled={isSubmitting || !isFormCurrentlyValid()}
              className={`px-6 py-3 text-white ${isSubmitting || !isFormCurrentlyValid() ? 'bg-sky-300 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-600'}`}
            >
              {isSubmitting ? <span className="inline-flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Saving...</span> : (event ? 'Update Event' : 'Create Event')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;

const ToggleSwitch = ({ checked = false, onChange }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center p-1 rounded-full transition-colors focus:outline-none ${checked ? 'bg-sky-500' : 'bg-gray-300'}`}
      style={{ width: 54, height: 30 }}
    >
      <span
        className="inline-block bg-white rounded-full transition-transform"
        style={{
          width: 26,
          height: 26,
          transform: checked ? 'translateX(24px)' : 'translateX(0px)'
        }}
      />
    </button>
  );
};
