import React, { useEffect, useMemo, useState } from 'react';
import { recordingService } from '../services/recordingService';
import './Recordings.css';

export default function Recordings() {
  const [recordings, setRecordings] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecording, setSelectedRecording] = useState(null);
  
  // Playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

useEffect(() => {
  // ✅ fetch recordings properly
  recordingService.listRecordings().then((res) => {
    setRecordings(res.data);

    if (res.data.length > 0 && !selectedRecording) {
      setSelectedRecording(res.data[0]);
    }
  });

  // ✅ subscribe for live updates
  const unsubscribe = recordingService.subscribe((updated) => {
    setRecordings(updated);

    if (updated.length > 0 && !selectedRecording) {
      setSelectedRecording(updated[0]);
    }
  });

  return unsubscribe;
}, [selectedRecording]);


  // Set default selection
  useEffect(() => {
    if (recordings.length > 0 && !selectedRecording) {
      setSelectedRecording(recordings[0]);
    }
  }, [recordings, selectedRecording]);

  // Playback timer effect
  useEffect(() => {
    let interval = null;
    if (isPlaying && selectedRecording) {
      const maxDuration = selectedRecording.totalDuration || selectedRecording.duration || 0;
      interval = setInterval(() => {
        setPlaybackTime((prev) => {
          if (prev >= maxDuration) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, selectedRecording]);

  // Reset playback time when selection changes
  useEffect(() => {
    setIsPlaying(false);
    setPlaybackTime(0);
  }, [selectedRecording]);

  // Search filter
  const filteredRecordings = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return recordings.filter((r) => {
      const name = String(r.name || '').toLowerCase();
      const id = String(r.id || '').toLowerCase();
      const location = String(r.location || '').toLowerCase();
      return name.includes(q) || id.includes(q) || location.includes(q);
    });
  }, [recordings, searchQuery]);

  // Formatting helpers
  const formatDuration = (totalSeconds) => {
    if (!totalSeconds) return '00:00:00';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const formatDateTime = (dateObj) => {
    if (!dateObj) return '';
    const day = String(dateObj.getDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    
    let hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = String(hours).padStart(2, '0');
    
    return `${day} ${month} ${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  };

  // Playback handlers
  const handlePlayPause = () => {
    if (!selectedRecording || selectedRecording.isLoading) return;
    const maxDuration = selectedRecording.totalDuration || selectedRecording.duration || 0;
    if (playbackTime >= maxDuration) {
      setPlaybackTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkipForward = () => {
    if (!selectedRecording || selectedRecording.isLoading) return;
    const maxDuration = selectedRecording.totalDuration || selectedRecording.duration || 0;
    setPlaybackTime((prev) => Math.min(prev + 5, maxDuration));
  };

  const handleSkipBackward = () => {
    if (!selectedRecording || selectedRecording.isLoading) return;
    setPlaybackTime((prev) => Math.max(prev - 5, 0));
  };

  const handleSliderChange = (e) => {
    if (!selectedRecording || selectedRecording.isLoading) return;
    setPlaybackTime(Number(e.target.value));
  };

  return (
    <div className="vms-recordings-container">
      <div className="vms-body-row">
        {/* Left Column: Player Viewport & Controls */}
        <div className="vms-left-column">
          <div className="vms-playback-card">
            {selectedRecording ? (
              <>
                <div className="playback-header-row">
                  <h3 className="playback-card-title">
                    {selectedRecording.isLoading ? (
                      selectedRecording.name
                    ) : (
                      <>
                        <span className="rec-id-label">#{selectedRecording.id}</span>
                        {' '}
                        {selectedRecording.name}
                        {' '}
                        <span className="rec-desc-sub text-slate">
                          {selectedRecording.location} | {selectedRecording.specs}
                        </span>
                      </>
                    )}
                  </h3>
                </div>

                <div className="playback-feed-viewport">
                  {selectedRecording.isLoading ? (
                    <div className="offline-center-notice">
                      {/* Offline icon centered */}
                      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#94a3b8" strokeWidth="1.5" style={{ marginBottom: '12px' }}>
                        <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.5M5 12.5a10.94 10.94 0 0 1 5.83-2.84M8.66 16.14a7 7 0 0 1 3.34-1.14M19 12.5a14.79 14.79 0 0 0-4.63-2.92M5 12.5a14.79 14.79 0 0 0 3.66-2.52M12 20h.01" />
                      </svg>
                      <span className="notice-text text-slate" style={{ fontSize: '14px', fontWeight: '600' }}>
                        LOADING DOC
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="feed-viewfinder-bracket tl"></div>
                      <div className="feed-viewfinder-bracket tr"></div>
                      <div className="feed-viewfinder-bracket bl"></div>
                      <div className="feed-viewfinder-bracket br"></div>
                    </>
                  )}
                </div>

                {/* Playback controls (Disabled if loading) */}
                <div className="playback-controls-bar">
                  <div className="playback-controls-left">
                    <button
                      type="button"
                      className="btn-playback-action"
                      onClick={handleSkipBackward}
                      disabled={selectedRecording.isLoading}
                      title="Skip Backward 5s"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M6 6h2v12H6zm3.5 6L18 6v12z"/>
                      </svg>
                    </button>
                    
                    <button
                      type="button"
                      className="btn-playback-action play-pause-btn"
                      onClick={handlePlayPause}
                      disabled={selectedRecording.isLoading}
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn-playback-action"
                      onClick={handleSkipForward}
                      disabled={selectedRecording.isLoading}
                      title="Skip Forward 5s"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M6 18l8.5-6L6 6zm9-12v12h2V6z"/>
                      </svg>
                    </button>
                  </div>

                  <div className="playback-timeline-container">
                    <span className="playback-time-text">
                      {formatDuration(playbackTime)} / {formatDuration(selectedRecording.totalDuration || selectedRecording.duration)}
                    </span>
                    <input
                      type="range"
                      className="playback-slider"
                      min="0"
                      max={selectedRecording.totalDuration || selectedRecording.duration || 0}
                      value={playbackTime}
                      onChange={handleSliderChange}
                      disabled={selectedRecording.isLoading}
                    />
                  </div>

                  <div className="playback-actions-right">
                    <button type="button" className="btn-playback-export" disabled={selectedRecording.isLoading}>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                      </svg>
                      Export
                    </button>
                  </div>
                </div>

                {/* Metadata details panel */}
                {!selectedRecording.isLoading && (
                  <div className="playback-metadata-grid">
                    <div className="metadata-card-col">
                      <div className="meta-card-header">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="meta-card-icon">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span className="meta-card-label">Created on</span>
                      </div>
                      <span className="meta-card-value">{formatDateTime(selectedRecording.createdOn)}</span>
                    </div>

                    <div className="metadata-card-col">
                      <div className="meta-card-header">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="meta-card-icon">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span className="meta-card-label">Recording Duration</span>
                      </div>
                      <span className="meta-card-value">{formatDuration(selectedRecording.totalDuration || selectedRecording.duration)}</span>
                    </div>

                    <div className="metadata-card-col">
                      <div className="meta-card-header">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="meta-card-icon">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 8 14"></polyline>
                        </svg>
                        <span className="meta-card-label">Video Time</span>
                      </div>
                      <span className="meta-card-value">
                        {selectedRecording.videoStartTime} - {selectedRecording.videoEndTime}
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="playback-empty-state">
                <h4>No Recording Selected</h4>
                <p>Select a video recording from the sidebar to play.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Search & Recordings List Sidebar */}
        <div className="vms-cameralist-wrapper">
          <div className="vms-cameralist-section">
            <h3 className="section-title">Recordings</h3>

            <div className="sidebar-search-box">
              <svg
                className="search-icon-svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>

              <input
                type="text"
                placeholder="Search Recordings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-field"
              />
            </div>

            <div className="sidebar-camera-scrollbox" style={{ marginTop: '8px' }}>
              {filteredRecordings.map((rec, index) => {
                const isSelected = selectedRecording && selectedRecording.id === rec.id;
                
                return (
                  <div
                    key={`${rec.id}-${index}`}
                    className={`sidebar-recording-item-card ${isSelected ? 'item-checked' : ''} ${rec.isLoading ? 'item-loading-doc' : ''}`}
                    onClick={() => setSelectedRecording(rec)}
                  >
                    <div className="item-recording-details">
                      {rec.isLoading ? (
                        <div className="loading-doc-card-inner">
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#94a3b8" strokeWidth="2" className="card-loading-icon">
                            <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.5M5 12.5a10.94 10.94 0 0 1 5.83-2.84M8.66 16.14a7 7 0 0 1 3.34-1.14M19 12.5a14.79 14.79 0 0 0-4.63-2.92M5 12.5a14.79 14.79 0 0 0 3.66-2.52M12 20h.01" />
                          </svg>
                          <span className="loading-doc-card-text">LOADING DOC</span>
                        </div>
                      ) : (
                        <>
                          <div className="recording-id-badge">#{rec.id}</div>
                          <h5 className="item-camera-name" style={{ marginTop: '8px' }}>
                            {rec.name.toUpperCase()}
                          </h5>
                          {rec.location && (
                            <span className="item-camera-location">
                              {rec.location}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredRecordings.length === 0 && (
                <div className="sidebar-empty-search">
                  <span className="empty-search-icon">🔍</span>
                  <span className="empty-search-text">No recordings found</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
