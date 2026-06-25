import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cameraService } from "../../../../DSMS/Features/Camera/services/cameraService";
import { recordingService } from "../../Recording/services/recordingService";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const MAX_DISPLAY_CAMERAS = 12;

  const [cameras, setCameras] = useState(() => cameraService.getCameras());
  const [searchQuery, setSearchQuery] = useState("");
  // const [checkedIds, setCheckedIds] = useState(() => {
  //   const list = cameraService.getCameras();
  //   return list.slice(0, MAX_DISPLAY_CAMERAS).map((camera) => camera.id);
  // });
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [gridCols, setGridCols] = useState(4);
  const [currentTime, setCurrentTime] = useState(new Date());

  // --- Recording & Playback States ---
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [recordStartTime, setRecordStartTime] = useState(null);
  const [recordEndTime, setRecordEndTime] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showFullscreenOverlays, setShowFullscreenOverlays] = useState(false);

  // --- MultiView Modal Configuration ---
  const [showMultiViewModal, setShowMultiViewModal] = useState(false);
  const [multiViewConfig, setMultiViewConfig] = useState(() => {
    const list = cameraService.getCameras();
    return {
      layout: '12',
      2: [list[0]?.id || '', list[1]?.id || ''],
      4: [list[0]?.id || '', list[1]?.id || '', list[2]?.id || '', list[3]?.id || ''],
      6: [list[0]?.id || '', list[1]?.id || '', list[2]?.id || '', list[3]?.id || '', list[4]?.id || '', list[5]?.id || ''],
      12: list.slice(0, 12).map(c => c.id)
    };
  });

  const [tempLayout, setTempLayout] = useState('default');
  const [tempConfig, setTempConfig] = useState(() => {
    const list = cameraService.getCameras();
    return {
      2: [list[0]?.id || '', list[1]?.id || ''],
      4: [list[0]?.id || '', list[1]?.id || '', list[2]?.id || '', list[3]?.id || ''],
      6: [list[0]?.id || '', list[1]?.id || '', list[2]?.id || '', list[3]?.id || '', list[4]?.id || '', list[5]?.id || ''],
      12: list.slice(0, 12).map(c => c.id)
    };
  });

  const layouts = [
    
    { key: '2', label: '2-Camera View', cols: 2, rows: 1 },
    { key: '4', label: '4-Camera View', cols: 2, rows: 2 },
    { key: '6', label: '6-Camera View', cols: 3, rows: 2 },
    { key: '12', label: '12-Camera View', cols: 4, rows: 3 }
  ];

  const configureSections = [
    { key: '2', label: '2 Camera View', count: 2 },
    { key: '4', label: '4 Camera View', count: 4 },
    { key: '6', label: '6 Camera View', count: 6 },
    { key: '12', label: '12 Camera View', count: 12 }
  ];

  // --- Effects for Timer Intervals ---
  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackTime((prev) => {
          if (prev >= recordingSeconds) {
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
  }, [isPlaying, recordingSeconds]);

  // Escape key exits fullscreen
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Handle mouse movement to show/hide controls in fullscreen
  useEffect(() => {
    if (!isFullscreen) {
      setShowFullscreenOverlays(false);
      document.body.classList.remove("vms-fullscreen-active");
      return;
    }

    document.body.classList.add("vms-fullscreen-active");
    setShowFullscreenOverlays(true);

    let timer = setTimeout(() => {
      setShowFullscreenOverlays(false);
    }, 2000);

    const handleMouseMove = () => {
      setShowFullscreenOverlays(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setShowFullscreenOverlays(false);
      }, 2000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.classList.remove("vms-fullscreen-active");
      clearTimeout(timer);
    };
  }, [isFullscreen]);

  // --- Formatting Helpers ---
  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const formatDateTime = (dateObj) => {
    if (!dateObj) return "";
    const day = String(dateObj.getDate()).padStart(2, "0");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[dateObj.getMonth()];
    const year = dateObj.getFullYear();

    let hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = String(hours).padStart(2, "0");

    return `${day} ${month} ${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  };

  const formatTimeOnly = (dateObj) => {
    if (!dateObj) return "";
    let hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;
  };

  // --- Handlers ---
  const handleSliderChange = (e) => {
    setPlaybackTime(Number(e.target.value));
  };

  const handlePlayPause = () => {
    if (playbackTime >= recordingSeconds) {
      setPlaybackTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkipForward = () => {
    setPlaybackTime((prev) => Math.min(prev + 5, recordingSeconds));
  };

  const handleSkipBackward = () => {
    setPlaybackTime((prev) => Math.max(prev - 5, 0));
  };

  const handleSaveRecording = () => {
    // Reset all selection states immediately to close the inline/fullscreen view
    setIsRecording(false);
    setRecordingSeconds(0);
    setHasRecorded(false);
    setIsPlaying(false);
    setPlaybackTime(0);
    setSelectedCamera(null);
    setIsFullscreen(false);

    // Show the save toast popup on the dashboard
    setShowSaveToast(true);
    setTimeout(() => {
      setShowSaveToast(false);
    }, 3000);
  };

  useEffect(() => {
    const unsubscribe = cameraService.subscribe((updatedList) => {
      setCameras(updatedList);

      // setCheckedIds((prev) => {
      //   const validIds = updatedList.map((camera) => camera.id);
      //   return prev.filter((id) => validIds.includes(id)).slice(0, MAX_DISPLAY_CAMERAS);
      // });
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const totalCount = cameras.length;
  const onlineCount = cameras.filter((camera) => camera.status === "Online").length;
  const offlineCount = totalCount - onlineCount;

  const recordingCount = cameras.filter(
    (camera, index) => camera.status === "Online" && index % 2 === 0
  ).length;

  const activeAlerts = 3;
  const totalEvents = 6;

  const filteredList = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return cameras.filter((camera) => {
      const name = String(camera.name || "").toLowerCase();
      const location = String(camera.location || "").toLowerCase();
      const id = String(camera.id || "").toLowerCase();

      return name.includes(query) || location.includes(query) || id.includes(query);
    });
  }, [cameras, searchQuery]);

  const videoWallCameras = useMemo(() => {
    const activeLayout = multiViewConfig.layout;
    const activeIds = multiViewConfig[activeLayout] || [];

    return activeIds.map((id, index) => {
      const camera = cameras.find((c) => c.id === id);
      return {
        ...(camera || { id: `mock-${id || index}`, name: camera?.name || `Window ${index + 1}`, status: camera?.status || 'Offline' }),
        uniqueKey: `${id || 'empty'}-${index}`
      };
    });
  }, [cameras, multiViewConfig]);

  const handleToggleCheck = (id) => {
  const layout = multiViewConfig.layout;
  const currentIds = multiViewConfig[layout] || [];

  let updated;

  if (currentIds.includes(id)) {
    // ✅ remove camera
    updated = currentIds.filter((c) => c !== id);
  } else {
    // ✅ add camera (limit max)
    if (currentIds.length >= MAX_DISPLAY_CAMERAS) return;
    updated = [...currentIds, id];
  }

  setMultiViewConfig({
    ...multiViewConfig,
    [layout]: updated   // ✅ CRITICAL FIX (this was missing)
  });
};


  const handleToggleAll = () => {
    const filteredIds = filteredList
      .slice(0, MAX_DISPLAY_CAMERAS)
      .map((camera) => camera.id);

    const allFilteredAreChecked =
      filteredIds.length > 0 && filteredIds.every((id) => checkedIds.includes(id));

    if (allFilteredAreChecked) {
      setCheckedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setCheckedIds(filteredIds);
    }
  };

  const formatHUDTime = () => {
    const pad = (number) => String(number).padStart(2, "0");

    return `${pad(currentTime.getHours())}:${pad(currentTime.getMinutes())}:${pad(
      currentTime.getSeconds()
    )}`;
  };

  const formatHUDDate = () => {
    const pad = (number) => String(number).padStart(2, "0");

    return `${currentTime.getFullYear()}-${pad(currentTime.getMonth() + 1)}-${pad(
      currentTime.getDate()
    )}`;
  };
  // ✅ SAME LOGIC AS VIDEO WALL (for selected camera)
let detailIsOffline = false;
let detailHasMotion = false;
let detailIsRecording = false;

if (selectedCamera) {
  detailIsOffline = selectedCamera.status === "Offline";

  const camIndex = cameras.findIndex(c => c.id === selectedCamera.id);

  detailHasMotion = !detailIsOffline && camIndex % 3 === 0;
  detailIsRecording = !detailIsOffline && camIndex % 2 === 0;
}

  return (
    <div className="vms-dashboard-container">
      {/* Toast Save Popup Notification */}
      {showSaveToast && (
        <div className="toast-floating-container">
          <div className="toast-alert-card toast-success">
            <div className="toast-icon-box">✓</div>
            <span className="toast-message-text">Record Saved Successfully!</span>
            <button className="btn-toast-close" onClick={() => setShowSaveToast(false)}>
              ×
            </button>
          </div>
        </div>
      )}
      {/* Title Bar */}
      <div className="vms-title-bar-row">
        <div className="title-bar-left">
          <button
            type="button"
            className="btn-vms-back"
            onClick={() => navigate("/camera-management")}
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>

            <span>Video Surveillance Dashboard</span>
          </button>
        </div>

        <div className="title-bar-right">
          <button
            type="button"
            className="btn-grid-single"
            onClick={() => {
              // Initialize temp states with current config
              setTempLayout(multiViewConfig.layout || 'default');
``
              setTempConfig({
                2: [...multiViewConfig[2]],
                4: [...multiViewConfig[4]],
                6: [...multiViewConfig[6]],
                12: [...multiViewConfig[12]]
              });
              setShowMultiViewModal(true);
            }}
            title="Configure MultiView Grid Layout"
          >
            <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
              <rect x="1" y="1" width="5" height="5" rx="1" />
              <rect x="7.5" y="1" width="5" height="5" rx="1" />
              <rect x="14" y="1" width="5" height="5" rx="1" />
              <rect x="1" y="7.5" width="5" height="5" rx="1" />
              <rect x="7.5" y="7.5" width="5" height="5" rx="1" />
              <rect x="14" y="7.5" width="5" height="5" rx="1" />
              <rect x="1" y="14" width="5" height="5" rx="1" />
              <rect x="7.5" y="14" width="5" height="5" rx="1" />
              <rect x="14" y="14" width="5" height="5" rx="1" />
            </svg>
          </button>
        </div>
      </div>

      <div className="vms-body-row">
        {/* Left Column */}
        <div className="vms-left-column">
          {/* Metrics Row */}
          <div className="vms-metrics-grid">
            {/* Card 1 */}
            <div className="vms-metric-card blue-metric">
              <div className="metric-header">
                <div className="metric-icon-circle blue-circle">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z" />
                  </svg>
                </div>

                <div className="metric-text-content">
                  <span className="metric-label">Total Cameras</span>
                  <span className="metric-sublabel">System Overview</span>
                </div>
              </div>

              <div className="metric-divider"></div>

              <span className="metric-value blue-val">{totalCount}</span>
              <span className="metric-subtext-total">Total Cameras</span>

              <span className="metric-subtext">
                <span className="red-dot">●</span> {offlineCount} Offline
              </span>
            </div>

            {/* Card 2 */}
            <div className="vms-metric-card green-metric">
              <div className="metric-header">
                <div className="metric-icon-circle green-circle">
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M1.5 8.5C5.5 4.5 18.5 4.5 22.5 8.5" />
                    <path d="M5 12c2-2 12-2 14 0" />
                    <path d="M8.5 15.5c1-1 6-1 7 0" />
                    <circle cx="12" cy="19" r="1" fill="currentColor" />
                  </svg>
                </div>

                <div className="metric-text-content">
                  <span className="metric-label">Active Streams</span>
                  <span className="metric-sublabel">Live Feed Status</span>
                </div>
              </div>

              <div className="metric-divider"></div>

              <span className="metric-value green-val">{onlineCount}</span>
              <span className="metric-subtext-total">Active Streams</span>

              <span className="metric-subtext">
                <span className="green-dot">●</span> Online Now
              </span>
            </div>

            {/* Card 3 */}
            <div className="vms-metric-card orange-metric">
              <div className="metric-header">
                <div className="metric-icon-circle orange-circle">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <circle cx="12" cy="12" r="10" fill="rgba(234,88,12,0.15)" />
                    <circle cx="12" cy="12" r="5" />
                  </svg>
                </div>

                <div className="metric-text-content">
                  <span className="metric-label">Recording Status</span>
                  <span className="metric-sublabel">Recording Overview</span>
                </div>
              </div>

              <div className="metric-divider"></div>

              <span className="metric-value orange-val">{recordingCount}</span>
              <span className="metric-subtext-total">Cameras Recording</span>

              <span className="metric-subtext">
                <span className="orange-dot">●</span> Recording Now
              </span>
            </div>

            {/* Card 4 */}
            <div className="vms-metric-card red-metric">
              <div className="metric-header">
                <div className="metric-icon-circle red-circle">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path
                      d="M13.73 21a2 2 0 0 1-3.46 0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                <div className="metric-text-content">
                  <span className="metric-label">Active Alerts</span>
                  <span className="metric-sublabel">Event Summary</span>
                </div>
              </div>

              <div className="metric-divider"></div>

              <span className="metric-value red-val">{activeAlerts}</span>
              <span className="metric-subtext-total">Active Alerts</span>

              <span className="metric-subtext">
                <span className="red-dot">●</span> {totalEvents} Total Events
              </span>
            </div>
          </div>

          {/* Video Wall / Inline Detail Conditional */}
          {selectedCamera ? (
            <div className={`vms-camera-detail-inline ${isFullscreen ? "fullscreen-mode" : ""} ${showFullscreenOverlays ? "show-overlays" : ""} ${hasRecorded ? "has-recorded-mode" : ""}`}>
              <div className="inline-detail-header">
               <div className="inline-detail-title-group">
  <h3 className="inline-camera-name">{selectedCamera.name}</h3>

  <span className="inline-camera-specs">
    #{selectedCamera.id} | {selectedCamera.locationDetail || "Building A"} | 4k . 30 fps
  </span>
</div>

                <button
                  type="button"
                  className="btn-inline-close"
                  onClick={() => {
                    setIsRecording(false);
                    setRecordingSeconds(0);
                    setHasRecorded(false);
                    setIsPlaying(false);
                    setPlaybackTime(0);
                    setSelectedCamera(null);
                  }}
                  title="Close and return to Video Wall"
                >
                  ✕
                </button>
              </div>

<div className="inline-feed-body">
  <div
    className={`
      inline-feed-viewport 
      ${isFullscreen ? "fullscreen-mode" : ""} 
      ${selectedCamera.status === "Offline" ? "feed-offline" : ""}
    `}
  >
    {selectedCamera.status === "Online" ? (
      <>
        {/* ✅ LIVE / MOTION / REC TAGS */}
        <div className="feed-tags-overlay">
  {detailIsOffline ? (
    <span className="feed-tag offline-tag">● OFFLINE</span>
  ) : (
    <>
      {/* ✅ Always LIVE when online */}
      <span className="feed-tag live-tag">● LIVE</span>

      {/* ✅ Only show if exists */}
      {detailHasMotion && (
        <span className="feed-tag motion-tag">● MOTION</span>
      )}

      {detailIsRecording && (
        <span className="feed-tag rec-tag">● REC</span>
      )}
    </>
  )}
</div>


        {/* ✅ CAMERA IMAGE */}
        <img
          src={selectedCamera.image || "/assets/cctv.png"}
          alt="camera feed"
          className="feed-video-image"
        />

        {/* ✅ VIEWFINDER (keep your existing) */}
        <div className="feed-viewfinder-bracket tl"></div>
        <div className="feed-viewfinder-bracket tr"></div>
        <div className="feed-viewfinder-bracket bl"></div>
        <div className="feed-viewfinder-bracket br"></div>

        {/* ✅ DETECTION BOXES */}
        <div className="detect-box helmet">
          <span>Helmet</span>
        </div>

        <div className="detect-box vest">
          <span>Vest</span>
        </div>

        <div className="detect-box mask">
          <span>Mask</span>
        </div>

        {/* ✅ RECORD HUD (only when recording) */}
        {isRecording && (
          <div className="feed-hud-overlay">
            <span className="hud-tag rec-tag-pulse">● REC</span>
            <span className="hud-time">
              {formatDuration(recordingSeconds)}
            </span>
          </div>
        )}
      </>
    ) : (
      <div className="feed-offline-state">
        <span className="offline-bullet">●</span>
        <span className="offline-text">SIGNAL LOST / OFFLINE</span>
      </div>
    )}
  </div>
</div>

              {/* Mode A: Live / Recording Mode */}
              {!hasRecorded && (
                <div className="inline-feed-controls">
                  <div className="controls-left">
                    <button
                      type="button"
                      className={`btn-control-stop ${isRecording ? "active" : "disabled"}`}
                      onClick={() => {
                        if (isRecording) {
                          setIsRecording(false);
                          setHasRecorded(true);
                          const endTime = new Date();
                          setRecordEndTime(endTime);

                          // Save the completed recording to the service
                          recordingService.createRecording({
                            name: selectedCamera.name,
                            location: selectedCamera.locationDetail || selectedCamera.location || 'Building A',
                            specs: '4k . 30 fps',
                            createdOn: recordStartTime || new Date(),
                            videoStartTime: formatTimeOnly(recordStartTime || new Date()),
                            videoEndTime: formatTimeOnly(endTime),
                            duration: recordingSeconds,
                            totalDuration: recordingSeconds
                          });
                        }
                      }}
                      disabled={!isRecording}
                    >
                      <span className="stop-icon-square"></span>
                      <span>Stop</span>
                    </button>
                    <button
                      type="button"
                      className={`btn-control-record ${isRecording ? "disabled" : "active"}`}
                      onClick={() => {
                        if (!isRecording) {
                          setIsRecording(true);
                          setRecordingSeconds(0);
                          setRecordStartTime(new Date());
                          setHasRecorded(false);
                        }
                      }}
                      disabled={isRecording}
                    >
                      <span className="record-icon-circle"></span>
                      <span>Record</span>
                    </button>

                    <div className="controls-divider">|</div>

                    <button type="button" className="btn-utility-icon" title="Microphone">
                      <img src="/assets/icon_mic.png" alt="Mic" className="icon-dark-blue" />
                    </button>
                    <button type="button" className="btn-utility-icon" title="Audio">
                      <img src="/assets/icon_audio.png" alt="Audio" className="icon-dark-blue" />
                    </button>

                    <div className="controls-divider">|</div>
                  </div>
                  <div className="controls-right">
                    <button
                      type="button"
                      className="btn-utility-icon expand-btn"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      title="Fullscreen"
                    >
                      <img src="/assets/icon_expand_diag.png" alt="Expand" className="icon-dark-blue" />
                    </button>
                  </div>
                </div>
              )}

              {/* Mode B: Playback Mode */}
              {hasRecorded && (
                <div className="inline-playback-section">
                  <div className="inline-feed-controls playback-mode-controls">
                    <div className="playback-controls-left">
                      <button
                        type="button"
                        className="btn-playback-action"
                        onClick={handleSkipBackward}
                        title="Skip Backward 5s"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M6 6h2v12H6zm3.5 6L18 6v12z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="btn-playback-action play-pause-btn"
                        onClick={handlePlayPause}
                        title={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? (
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn-playback-action"
                        onClick={handleSkipForward}
                        title="Skip Forward 5s"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M6 18l8.5-6L6 6zm9-12v12h2V6z" />
                        </svg>
                      </button>
                    </div>

                    <div className="playback-timeline-container">
                      <input
                        type="range"
                        className="playback-slider"
                        min="0"
                        max={recordingSeconds}
                        value={playbackTime}
                        onChange={handleSliderChange}
                      />
                      <span className="playback-time-text">
                        {formatDuration(playbackTime)} / {formatDuration(recordingSeconds)}
                      </span>
                    </div>

                    <div className="playback-actions-right">
                      <button
                        type="button"
                        className="btn-playback-save"
                        onClick={handleSaveRecording}
                      >
                        Save
                      </button>
                      <button type="button" className="btn-playback-export">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                        </svg>
                        Export
                      </button>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="playback-metadata-row">
                    <div className="metadata-col">
                      <div className="meta-header-group">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="meta-icon">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span className="meta-col-title">Created on</span>
                      </div>
                      <span className="meta-col-value">{formatDateTime(recordStartTime)}</span>
                    </div>

                    <div className="metadata-col">
                      <div className="meta-header-group">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="meta-icon">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span className="meta-col-title">Recording Duration</span>
                      </div>
                      <span className="meta-col-value">{formatDuration(recordingSeconds)}</span>
                    </div>

                    <div className="metadata-col">
                      <div className="meta-header-group">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="meta-icon">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 8 14"></polyline>
                        </svg>
                        <span className="meta-col-title">Video Time</span>
                      </div>
                      <span className="meta-col-value">
                        {formatTimeOnly(recordStartTime)} - {formatTimeOnly(recordEndTime)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="vms-videowall-section">
              <div className="videowall-header-row">
                <h3 className="section-title">Video Wall</h3>
                <span className="section-subtitle">
                  {onlineCount} / {totalCount} online
                </span>
              </div>

              {videoWallCameras.length > 0 ? (
                <div className={`videowall-grid cols-${gridCols}`}>
                  {videoWallCameras.map((camera, index) => {
                    const isOffline = camera.status === "Offline";
                    const hasMotion = !isOffline && index % 3 === 0;
                    const isRecording = !isOffline && index % 2 === 0;

                    return (
                      <div
                        key={camera.uniqueKey || camera.id}
                        className={`video-feed-card ${isOffline ? "offline" : ""}`}
                        onClick={() => setSelectedCamera(camera)}
                      >
                        <div className="feed-tags-overlay">
                          {isOffline ? (
                            <span className="feed-tag offline-tag">● OFFLINE</span>
                          ) : (
                            <>
                              <span className="feed-tag live-tag">● LIVE</span>
                              {hasMotion && (
                                <span className="feed-tag motion-tag">● MOTION</span>
                              )}
                              {isRecording && (
                                <span className="feed-tag rec-tag">● REC</span>
                              )}
                            </>
                          )}
                        </div>
<div className="feed-viewport">
  {!isOffline ? (
    <>
      {/* ✅ ADD IMAGE HERE */}
      <img
        src={camera.image || '/assets/cctv.png'}
        alt="camera feed"
        className="feed-video-image"
      />

      {/* keep your existing effects */}
      <div className="feed-scan-line"></div>

      <div className="feed-viewfinder-bracket tl"></div>
      <div className="feed-viewfinder-bracket tr"></div>
      <div className="feed-viewfinder-bracket bl"></div>
      <div className="feed-viewfinder-bracket br"></div>

      {/* ✅ optional detection boxes */}
      <div className="detect-box helmet"></div>
      <div className="detect-box vest"></div>

      <div className="feed-hud-overlay">
        <span className="hud-cam-id">{camera.id}</span>
        <span className="hud-time">{formatHUDTime()}</span>
      </div>

    </>
  ) : (
    <div className="feed-offline-state">
      <span className="offline-text">OFFLINE</span>
    </div>
  )}
</div>

                        <div className="feed-footer-overlay">
  <span className="footer-camera-name">
    {camera.name.toUpperCase()}
  </span>

  <span className="footer-camera-id">
    #{camera.id}
  </span>
</div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="vms-empty-wall-state">
                  <div className="empty-wall-icon">
                    <svg
                      viewBox="0 0 24 24"
                      width="48"
                      height="48"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                  </div>

                  <h4>No Cameras Selected</h4>
                  <p>
                    Check cameras from the list on the right to display them on the
                    Video Wall.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="vms-cameralist-wrapper">
          <div className="vms-cameralist-section">
            <h3 className="section-title">Camera List</h3>

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
                placeholder="Search Cameras..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="search-input-field"
              />
            </div>



            <div className="sidebar-camera-scrollbox">
              {filteredList.map((camera, index) => {
                const isChecked =
  multiViewConfig[multiViewConfig.layout]?.includes(camera.id);

                const isOffline = camera.status === "Offline";
                const hasMotion = !isOffline && index % 3 === 0;
                const isRecording = !isOffline && index % 2 === 0;

                return (
                  <div
                    key={camera.id}
                    className={`sidebar-camera-item-card ${isChecked ? "item-checked" : ""
                      } ${isOffline ? "item-offline" : ""}`}
                    onClick={() => handleToggleCheck(camera.id)}
                  >
                    <div className="item-left-select">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => { }}
                        className="custom-sidebar-checkbox"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleToggleCheck(camera.id);
                        }}
                      />
                    </div>

                    <div className="item-right-details">
                      <div className="item-badges">
                        {isOffline ? (
                          <span className="badge offline-badge">● OFFLINE</span>
                        ) : (
                          <>
                            <span className="badge live-badge">● LIVE</span>
                            {isRecording && (
                              <span className="badge rec-badge">● REC</span>
                            )}
                            {hasMotion && (
                              <span className="badge motion-badge">● MOTION</span>
                            )}
                          </>
                        )}
                      </div>

                      <h5 className="item-camera-name">
                        {camera.name.toUpperCase()}
                      </h5>

                      <span className="item-camera-location">
                        {camera.locationDetail || "Main Building"}
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredList.length === 0 && (
                <div className="sidebar-empty-search">
                  <span className="empty-search-icon">🔍</span>
                  <span className="empty-search-text">No matching cameras found</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MultiView Configuration Drawer */}
      <div
        className={`vms-drawer-overlay ${showMultiViewModal ? 'active' : ''}`}
        onClick={() => setShowMultiViewModal(false)}
      ></div>
      <div className={`vms-drawer-container ${showMultiViewModal ? 'active' : ''}`}>
        {showMultiViewModal && (
          <div className="vms-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
       <h3 className="modal-title">
  <span className="multiview-title-wrap">
    <span className="multiview-header-icon">
      <svg viewBox="0 0 64 64" width="38" height="38" fill="currentColor">
        <path d="M37 20l3-2 4 2 1 4 3 1v4l-3 1-1 4-4 2-3-2-4 2-4-2-1-4-3-1v-4l3-1 1-4 4-2z"/>
        <circle cx="37" cy="26" r="4" fill="#fff"/>
        <path d="M20 34l2-1 3 1 1 3 2 1v3l-2 1-1 3-3 1-2-1-3 1-3-1-1-3-2-1v-3l2-1 1-3 3-1z"/>
        <circle cx="20" cy="39" r="3" fill="#fff"/>
      </svg>
    </span>

    <span>MultiView Configuration</span>
  </span>
</h3>

              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setShowMultiViewModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="multiview-modal-body">
              {/* Select Camera View */}
              <div className="multiview-section-block">
                <div className="multiview-section-header no-border">
                  <span className="multiview-header-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M23 7l-7 5 7 5V7z" />
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                        </svg>
                  </span>
                  <div className="multiview-section-title-group">
                    <h4 className="multiview-section-title">Select Camera View</h4>
                    <span className="multiview-section-subtitle">Choose number of camera feed for multiview</span>
                  </div>
                </div>

                <div className="multiview-layouts-grid">
                  {layouts.map((lay) => (
                    <label key={lay.key} className={`multiview-layout-card ${tempLayout === lay.key ? 'card-selected' : ''}`}>
                      <input
                        type="radio"
                        name="multiview-layout"
                        checked={tempLayout === lay.key}
                        onChange={() => setTempLayout(lay.key)}
                        className="multiview-radio"
                      />
                      <div className={`mockup-grid layout-${lay.key}`}>
                        {Array.from({ length: lay.cols * lay.rows }).map((_, i) => (
                          <div key={i} className="mockup-cell"></div>
                        ))}
                      </div>
                      <span className="multiview-card-label">{lay.label}</span>
                    </label>
                  ))}
                </div>
                
<div className="multiview-default-option">
  <input
    type="radio"
    name="multiview-layout"
    checked={tempLayout === 'default'}
    onChange={() => setTempLayout('default')}
  />
  <label>Default</label>
</div>

              </div>

              {/* Scrollable dropdowns area */}
              <div className="multiview-dropdowns-scrollbox">
                {configureSections.filter(section => section.key === tempLayout).map((section) => (
                  <div key={section.key} className="multiview-section-block nested-section">
                    <div className="multiview-section-header">
                      <span className="multiview-header-icon">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M23 7l-7 5 7 5V7z" />
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                        </svg>
                      </span>
                      <div className="multiview-section-title-group">
                        <h4 className="multiview-section-title">{section.label}</h4>
                        <span className="multiview-section-subtitle">Select camera for each window</span>
                      </div>
                    </div>

                    <div className="multiview-dropdowns-grid">
                      {Array.from({ length: section.count }).map((_, winIdx) => {
                        const currentValue = tempConfig[section.key]?.[winIdx] || '';
                        return (
                          <div key={winIdx} className="multiview-dropdown-field">
                            <label className="multiview-field-label">Window {winIdx + 1}</label>
                            <div className="multiview-select-wrapper">
                              <span className="select-icon-camera">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M23 7l-7 5 7 5V7z" />
                                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                                </svg>
                              </span>
                              <select
                                value={currentValue}
                                onChange={(e) => {
                                  const newArr = [...(tempConfig[section.key] || [])];
                                  newArr[winIdx] = e.target.value;
                                  setTempConfig({
                                    ...tempConfig,
                                    [section.key]: newArr
                                  });
                                }}
                                className="multiview-select-element"
                              >
                                <option value="">Select Camera</option>
                                {cameras.map((cam) => (
                                  <option key={cam.id} value={cam.id}>
                                    {cam.name}
                                  </option>
                                ))}
                              </select>
                              <span className="select-arrow-down">▼</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="multiview-modal-footer">
              <button
  type="button"
  className="btn-multiview-save"
  onClick={() => {

    // ✅ Fix default layout
    const finalLayout = tempLayout === 'default' ? '12' : tempLayout;

    // ✅ Save correct config
    const finalConfig = {
      ...multiViewConfig,
      layout: finalLayout,
      [finalLayout]: tempConfig[finalLayout]
    };

    setMultiViewConfig(finalConfig);

    // ✅ Update grid layout properly
    if (finalLayout === '2') setGridCols(2);
    else if (finalLayout === '4') setGridCols(2);
    else if (finalLayout === '6') setGridCols(3);
    else setGridCols(4);

    // ✅ Close modal
    setShowMultiViewModal(false);
  }}
>
  Save
</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}