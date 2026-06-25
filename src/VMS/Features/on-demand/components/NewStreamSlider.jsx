import React, { useState, useEffect } from "react";
import "./NewStreamSlider.css";

export default function NewStreamSlider({ isOpen, onClose, onSubmit, editingRequest }) {
  const [formData, setFormData] = useState({
    requestName: "",
    priority: "",
    camera: "",
    sourceStream: "",
    purpose: "",
    startDateTime: "",
    lastDateTime: "",
    duration: "",
    resolution: "",
    frameRate: "",
    bitrate: "",
    codec: ""
  });

  const [sections, setSections] = useState({
    requestDetails: true,
    timeDuration: false,
    streamOptions: false
  });

  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (editingRequest) {
      // Parse dates back to datetime-local values (YYYY-MM-DDTHH:mm) if possible
      const parseDate = (dStr) => {
        if (!dStr) return "";
        const d = new Date(dStr);
        if (isNaN(d.getTime())) return "";
        const tzoffset = d.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(d - tzoffset)).toISOString().slice(0, 16);
        return localISOTime;
      };

      setFormData({
        requestName: editingRequest.camera, // Using camera name as request name for convenience
        priority: editingRequest.id.slice(4, 8),
        camera: editingRequest.camera,
        sourceStream: "Main Stream",
        purpose: "Update stream request details",
        startDateTime: parseDate(editingRequest.startDate),
        lastDateTime: parseDate(editingRequest.lastDate),
        duration: editingRequest.duration,
        resolution: editingRequest.resolution,
        frameRate: "30",
        bitrate: "4000 Kbps",
        codec: "H.264"
      });
      // Expand first section
      setSections({
        requestDetails: true,
        timeDuration: false,
        streamOptions: false
      });
    } else {
      // Clear form
      setFormData({
        requestName: "",
        priority: "",
        camera: "",
        sourceStream: "",
        purpose: "",
        startDateTime: "",
        lastDateTime: "",
        duration: "",
        resolution: "",
        frameRate: "",
        bitrate: "",
        codec: ""
      });
    }
    setTouched({});
    setSubmitted(false);
  }, [editingRequest, isOpen]);

  const toggleSection = (section) => {
    setSections((prev) => {
      const isOpen = prev[section];
      return {
        requestDetails: false,
        timeDuration: false,
        streamOptions: false,
        [section]: !isOpen
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getErrors = () => {
    const errs = {};
    if (!formData.requestName.trim()) errs.requestName = "Request Name is required";
    if (!formData.camera) errs.camera = "Camera is required";
    if (!formData.sourceStream) errs.sourceStream = "Source Stream is required";
    if (!formData.startDateTime) errs.startDateTime = "Start Date Time is required";
    if (!formData.lastDateTime) errs.lastDateTime = "Last Date Time is required";
    return errs;
  };

  const errors = getErrors();

  const handleRequestSubmit = () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) {
      const allTouched = {};
      Object.keys(errors).forEach((k) => {
        allTouched[k] = true;
      });
      setTouched(allTouched);

      // Auto expand the first section containing errors
      if (errors.requestName || errors.camera || errors.sourceStream) {
        setSections({ requestDetails: true, timeDuration: false, streamOptions: false });
      } else if (errors.startDateTime || errors.lastDateTime) {
        setSections({ requestDetails: false, timeDuration: true, streamOptions: false });
      }
      return;
    }

    onSubmit(formData);
  };

  const isInvalid = (field) => {
    return errors[field] && (touched[field] || submitted);
  };

  if (!isOpen) return null;

  return (
    <div className="new-stream-slider-overlay" onClick={onClose}>
      <div
        className="new-stream-slider-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="add-camera-page">
          {/* Header */}
          <div className="page-header">
            <div className="page-header-left">
              <div className="header-title-with-icon">
                <span className="header-icon" style={{ color: "#2563eb" }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="2" />
                    <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
                  </svg>
                </span>
                <h1>{editingRequest ? "Edit Stream Request" : "New Stream Request"}</h1>
              </div>
              <p>Please provide details for stream</p>
            </div>
            <button type="button" className="close-btn" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>

          <form className="camera-form" onSubmit={(e) => e.preventDefault()}>
            <div className="camera-form-scrollable">
              
              {/* Section 1: Request Details */}
              <section className="section-card">
                <div className="section-header" onClick={() => toggleSection('requestDetails')}>
                  <div className="section-title-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="section-icon">
                      <path d="M23 7l-7 5 7 5V7z"></path>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                    </svg>
                    <h2>Request Details</h2>
                  </div>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`chevron-arrow ${!sections.requestDetails ? 'rotate' : ''}`}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>

                {sections.requestDetails && (
                  <div className="section-body">
                    <div className="form-grid four-col">
                      <div className="form-group span-two-cols" style={{ gridColumn: 'span 2' }}>
                        <label>Request Name <span className="required-asterisk">*</span></label>
                        <input
                          type="text"
                          name="requestName"
                          value={formData.requestName}
                          onChange={handleChange}
                          onBlur={() => handleBlur('requestName')}
                          placeholder="Enter Camera Name"
                        />
                        {isInvalid('requestName') && <small className="error">{errors.requestName}</small>}
                      </div>

                      <div className="form-group">
                        <label>Priority</label>
                        <input
                          type="text"
                          name="priority"
                          value={formData.priority}
                          onChange={handleChange}
                          placeholder="Enter Serial Number"
                        />
                      </div>

                      <div className="form-group">
                        <label>Camera <span className="required-asterisk">*</span></label>
                        <select
                          name="camera"
                          value={formData.camera}
                          onChange={handleChange}
                          onBlur={() => handleBlur('camera')}
                        >
                          <option value="" disabled>Select Camera</option>
                          <option value="Main Gate Camera">Main Gate Camera</option>
                          <option value="Production Line 1">Production Line 1</option>
                          <option value="Warehouse Entrance">Warehouse Entrance</option>
                          <option value="Parking Area Camera">Parking Area Camera</option>
                          <option value="Dispatch Area">Dispatch Area</option>
                        </select>
                        {isInvalid('camera') && <small className="error">{errors.camera}</small>}
                      </div>

                      <div className="form-group">
                        <label>Source Stream <span className="required-asterisk">*</span></label>
                        <select
                          name="sourceStream"
                          value={formData.sourceStream}
                          onChange={handleChange}
                          onBlur={() => handleBlur('sourceStream')}
                        >
                          <option value="" disabled>Select Stream</option>
                          <option value="Main Stream">Main Stream</option>
                          <option value="Sub Stream">Sub Stream</option>
                        </select>
                        {isInvalid('sourceStream') && <small className="error">{errors.sourceStream}</small>}
                      </div>

                      <div className="form-group span-two-cols" style={{ gridColumn: 'span 2' }}>
                        <label>Purpose</label>
                        <input
                          type="text"
                          name="purpose"
                          value={formData.purpose}
                          onChange={handleChange}
                          placeholder="Enter Description (optional)"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Section 2: Time & Duration */}
              <section className="section-card">
                <div className="section-header" onClick={() => toggleSection('timeDuration')}>
                  <div className="section-title-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="section-icon">
                      <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <h2>Time & Duration</h2>
                  </div>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`chevron-arrow ${!sections.timeDuration ? 'rotate' : ''}`}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>

                {sections.timeDuration && (
                  <div className="section-body">
                    <div className="form-grid three-col">
                      <div className="form-group">
                        <label>Start Date Time <span className="required-asterisk">*</span></label>
                        <input
                          type="datetime-local"
                          name="startDateTime"
                          value={formData.startDateTime}
                          onChange={handleChange}
                          onBlur={() => handleBlur('startDateTime')}
                        />
                        {isInvalid('startDateTime') && <small className="error">{errors.startDateTime}</small>}
                      </div>

                      <div className="form-group">
                        <label>Last Date Time <span className="required-asterisk">*</span></label>
                        <input
                          type="datetime-local"
                          name="lastDateTime"
                          value={formData.lastDateTime}
                          onChange={handleChange}
                          onBlur={() => handleBlur('lastDateTime')}
                        />
                        {isInvalid('lastDateTime') && <small className="error">{errors.lastDateTime}</small>}
                      </div>

                      <div className="form-group">
                        <label>Duration</label>
                        <input
                          type="text"
                          name="duration"
                          value={formData.duration}
                          onChange={handleChange}
                          placeholder="Enter duration (hh:mm:ss)"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Section 3: Stream Options */}
              <section className="section-card">
                <div className="section-header" onClick={() => toggleSection('streamOptions')}>
                  <div className="section-title-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="section-icon">
                      <circle cx="12" cy="12" r="2" />
                      <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
                    </svg>
                    <h2>Stream Options</h2>
                  </div>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`chevron-arrow ${!sections.streamOptions ? 'rotate' : ''}`}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>

                {sections.streamOptions && (
                  <div className="section-body">
                    <div className="form-grid four-col">
                      <div className="form-group">
                        <label>Resolution</label>
                        <select
                          name="resolution"
                          value={formData.resolution}
                          onChange={handleChange}
                        >
                          <option value="" disabled>Select Resolution</option>
                          <option value="1080p">1080p</option>
                          <option value="720p">720p</option>
                          <option value="4K">4K</option>
                          <option value="360p">360p</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Frame Rate (fps)</label>
                        <select
                          name="frameRate"
                          value={formData.frameRate}
                          onChange={handleChange}
                        >
                          <option value="" disabled>Select Frame Rate</option>
                          <option value="30">30 fps</option>
                          <option value="60">60 fps</option>
                          <option value="15">15 fps</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Bitrate</label>
                        <select
                          name="bitrate"
                          value={formData.bitrate}
                          onChange={handleChange}
                        >
                          <option value="" disabled>Select Bitrate</option>
                          <option value="2000 Kbps">2000 Kbps</option>
                          <option value="4000 Kbps">4000 Kbps</option>
                          <option value="8000 Kbps">8000 Kbps</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Codec</label>
                        <select
                          name="codec"
                          value={formData.codec}
                          onChange={handleChange}
                        >
                          <option value="" disabled>Select Codec</option>
                          <option value="H.264">H.264</option>
                          <option value="H.265">H.265</option>
                          <option value="MJPEG">MJPEG</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </section>

            </div>

            {/* Footer Actions */}
            <div className="footer-actions">
              <button type="button" className="btn btn-cancel" onClick={onClose}>Cancel</button>
              <button type="button" className="btn btn-draft" onClick={() => { onSubmit({ ...formData, draft: true }); }}>Save Draft</button>
              <button type="button" className="btn btn-primary" onClick={handleRequestSubmit}>
                {editingRequest ? "Update Request" : "Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
