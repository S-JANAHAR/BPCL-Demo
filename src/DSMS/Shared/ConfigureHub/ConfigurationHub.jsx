import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cameraService } from '../../Features/Camera/services/cameraService';
import './ConfigurationHub.css';

const DEFAULT_RECORDING = {
  retentionSchedule: '30 days',
  archive: 'Enabled',
  exportOption: 'Enabled'
};

const DEFAULT_AI_RULES = [
  {
    model: 'PPE Non-Compliance',
    threshold: '70',
    gpuJobs: '5',
    metadata: '10'
  },
  {
    model: 'Restricted Zone',
    threshold: '70',
    gpuJobs: '8',
    metadata: '10'
  },
  {
    model: 'Barricading / Safety Railing',
    threshold: '70',
    gpuJobs: '4',
    metadata: '7'
  }
];

const DEFAULT_ALERTS = {
  severity: 'High',
  escalation: 'Level 2',
  site: 'Plant A',
  notification: 'Email',
  websocket: 'Enabled'
};

const DEFAULT_STREAMING = [
  {
    profileName: '',
    streamQuality: '',
    codec: '',
    resolution: '',
    bitrate: ''
  },
  {
    profileName: 'Mobile',
    streamQuality: 'Low',
    codec: 'H.265',
    resolution: '854×480',
    bitrate: '150'
  },
  {
    profileName: 'Event',
    streamQuality: 'High',
    codec: 'H.264',
    resolution: '1280×720',
    bitrate: '150'
  }
];

export default function ConfigurationHub({ camera: propCamera, onClose }) {
  const camera = propCamera || cameraService.getEditingCamera();
  const navigate = useNavigate();

  // --- States ---
  const [activeTab, setActiveTab] = useState(null);

  const [retentionSchedule, setRetentionSchedule] = useState(() =>
    camera?.configuration?.recording?.retentionSchedule || ''
  );
  const [archive, setArchive] = useState(() =>
    camera?.configuration?.recording?.archive || ''
  );
  const [exportOption, setExportOption] = useState(() =>
    camera?.configuration?.recording?.exportOption || ''
  );

  const [aiRules, setAiRules] = useState(() =>
    camera?.configuration?.aiRules || []
  );

  const [alertRules, setAlertRules] = useState(() =>
    camera?.configuration?.alerts || {
      severity: '',
      escalation: '',
      site: '',
      notification: '',
      websocket: ''
    }
  );

  const [streamProfiles, setStreamProfiles] = useState(() =>
    camera?.configuration?.streaming || []
  );

  const [toast, setToast] = useState({
    show: false,
    message: ''
  });

  // Synchronize fields when camera changes
  useEffect(() => {
    setRetentionSchedule(camera?.configuration?.recording?.retentionSchedule || '');
    setArchive(camera?.configuration?.recording?.archive || '');
    setExportOption(camera?.configuration?.recording?.exportOption || '');
    setAiRules(camera?.configuration?.aiRules || []);
    setAlertRules(camera?.configuration?.alerts || {
      severity: '',
      escalation: '',
      site: '',
      notification: '',
      websocket: ''
    });
    setStreamProfiles(camera?.configuration?.streaming || []);
    setActiveTab(null); // start collapsed
  }, [camera]);

  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.show]);

  // --- Handlers ---
  const handleHeaderClick = (targetTab) => {
    setActiveTab((prev) => (prev === targetTab ? null : targetTab));
  };

  const handleSave = (tabName, dataKey, dataVal) => {
    if (camera) {
      const currentConfig = camera.configuration || {};
      const updatedCamera = {
        ...camera,
        configuration: {
          ...currentConfig,
          [dataKey]: dataVal
        }
      };
      cameraService.updateCamera(updatedCamera);
    }
    setToast({
      show: true,
      message: `${tabName} configuration saved successfully`
    });
  };

  const handleCancel = (tabType) => {
    if (tabType === 'recording') {
      setRetentionSchedule(camera?.configuration?.recording?.retentionSchedule || '');
      setArchive(camera?.configuration?.recording?.archive || '');
      setExportOption(camera?.configuration?.recording?.exportOption || '');
    } else if (tabType === 'ai-rule') {
      setAiRules(camera?.configuration?.aiRules || []);
    } else if (tabType === 'alerts') {
      setAlertRules(camera?.configuration?.alerts || {
        severity: '',
        escalation: '',
        site: '',
        notification: '',
        websocket: ''
      });
    } else if (tabType === 'streaming') {
      setStreamProfiles(camera?.configuration?.streaming || []);
    }
  };

  // --- AI Rule Actions ---
  const addAiRule = () => {
    setAiRules((prev) => [
      ...prev,
      {
        model: '',
        threshold: '',
        gpuJobs: '',
        metadata: ''
      }
    ]);
  };

  const updateAiRule = (index, field, value) => {
    setAiRules((prev) =>
      prev.map((rule, i) => (i === index ? { ...rule, [field]: value } : rule))
    );
  };

  const removeAiRule = (index) => {
    setAiRules((prev) => prev.filter((_, i) => i !== index));
  };

  // --- Streaming Profile Actions ---
  const addStreamingProfile = () => {
    setStreamProfiles((prev) => [
      ...prev,
      {
        profileName: '',
        streamQuality: '',
        codec: '',
        resolution: '',
        bitrate: ''
      }
    ]);
  };

  const updateStreamingProfile = (index, field, value) => {
    setStreamProfiles((prev) =>
      prev.map((profile, i) => (i === index ? { ...profile, [field]: value } : profile))
    );
  };

  const removeStreamingProfile = (index) => {
    setStreamProfiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="ch-page-wrapper">
      {onClose && (
        <div className="page-header">
          <div className="page-header-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src="/assets/icon_settings.png" 
              alt="Configuration" 
              className="ch-header-settings-icon" 
              style={{ width: '22px', height: '22px', objectFit: 'contain' }} 
            />
            <div>
              <h1 style={{ margin: 0 }}>Configuration Hub</h1>
              <p style={{ margin: '2px 0 0 0' }}>Manage system configuration settings</p>
            </div>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
      )}
      {/* Toast Notification */}
      {toast.show && (
        <div className="config-toast-card">
          <div className="config-toast-left-border"></div>
          <div className="config-toast-icon-area">
            <span className="config-toast-check">✓</span>
          </div>
          <div className="config-toast-message">{toast.message}</div>
          <button
            type="button"
            className="config-toast-close"
            onClick={() => setToast({ show: false, message: '' })}
            aria-label="Close toast"
          >
            ×
          </button>
        </div>
      )}

      {/* Accordion List Container */}
      <div className="ch-accordion">

        {/* ========================================================
            PANEL 1: RECORDING
           ======================================================== */}
        <div className={`ch-accordion-item ${activeTab === 'recording' ? 'active' : ''}`}>
          <div className="ch-accordion-header" onClick={() => handleHeaderClick('recording')}>
            <img src="/assets/icon_recording.png" alt="Recording" className="ch-accordion-header-icon" />
            <div className="ch-accordion-header-text">
              <div className="ch-header-title">Recording</div>
              <div className="ch-header-subtitle">Configure the recording settings</div>
            </div>
          </div>

          {activeTab === 'recording' && (
            <div className="ch-accordion-body">
              <div className="ch-form-grid">
                <div className="ch-form-group">
                  <label className="ch-field-label">
                    Retention Schedule <span className="required">*</span>
                  </label>
                  <div className="ch-field-desc">Select how long recordings are retrained .</div>
                  <select
                    className="ch-select-input"
                    value={retentionSchedule}
                    onChange={(e) => setRetentionSchedule(e.target.value)}
                  >
                    <option value="" disabled>Select Retention Schedule</option>
                    <option>30 days</option>
                    <option>60 days</option>
                    <option>90 days</option>
                  </select>
                </div>

                <div className="ch-form-group">
                  <label className="ch-field-label">
                    Archive <span className="required">*</span>
                  </label>
                  <div className="ch-field-desc">Enable or disable archiving after retention period.</div>
                  <select
                    className="ch-select-input"
                    value={archive}
                    onChange={(e) => setArchive(e.target.value)}
                  >
                    <option value="" disabled>Select Archive Option</option>
                    <option>Enabled</option>
                    <option>Disabled</option>
                  </select>
                </div>

                <div className="ch-form-group">
                  <label className="ch-field-label">
                    Export <span className="required">*</span>
                  </label>
                  <div className="ch-field-desc">Enable or disable export of recorded data.</div>
                  <select
                    className="ch-select-input"
                    value={exportOption}
                    onChange={(e) => setExportOption(e.target.value)}
                  >
                    <option value="" disabled>Select Export Option</option>
                    <option>Enabled</option>
                    <option>Disabled</option>
                  </select>
                </div>
              </div>

              <div className="ch-form-actions">
                <button
                  type="button"
                  className="ch-btn-cancel"
                  onClick={() => handleCancel('recording')}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="ch-btn-save"
                  onClick={() => handleSave('Recording', 'recording', { retentionSchedule, archive, exportOption })}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            PANEL 2: AI RULE
           ======================================================== */}
        <div className={`ch-accordion-item ${activeTab === 'ai-rule' ? 'active' : ''}`}>
          <div className="ch-accordion-header" onClick={() => handleHeaderClick('ai-rule')}>
            <img src="/assets/icon_ai_rule.png" alt="AI Rule" className="ch-accordion-header-icon" />
            <div className="ch-accordion-header-text">
              <div className="ch-header-title">AI Rule</div>
              <div className="ch-header-subtitle">Configure the ai rule settings</div>
            </div>
          </div>

          {activeTab === 'ai-rule' && (
            <div className="ch-accordion-body scroll-hidden">
              <div className="ch-section-header">
                <div>
                  <h4 className="ch-body-title">Configure AI Settings</h4>
                  <p className="ch-body-subtitle">Select configure AI setting parameters.</p>
                </div>
                <button type="button" className="ch-btn-add" onClick={addAiRule}>
                  + Add
                </button>
              </div>

              {/* Scrollable list of rule blocks */}
              <div className="ch-scrollable-container">
                {aiRules.map((rule, index) => (
                  <div className="ch-rule-card" key={index}>
                    <button
                      type="button"
                      className="ch-card-close-btn"
                      onClick={() => removeAiRule(index)}
                      aria-label="Remove AI Rule"
                      title="Remove AI Rule"
                    >
                      ✕
                    </button>

                    <div className="ch-rule-grid">
                      {/* Model Dropdown */}
                      <div className="ch-grid-group col-models">
                        <label className="ch-grid-label">
                          Models <span className="required">*</span>
                        </label>
                        <select
                          className="ch-select-input"
                          value={rule.model}
                          onChange={(e) => updateAiRule(index, 'model', e.target.value)}
                        >
                          <option value="" disabled>Select Model</option>
                          <option>PPE Non-Compliance</option>
                          <option>Restricted Zone</option>
                          <option>Barricading / Safety Railing</option>
                          <option>Unauthorized Entry</option>
                        </select>
                      </div>

                      {/* Threshold Input */}
                      <div className="ch-grid-group col-threshold">
                        <label className="ch-grid-label">
                          Threshold(1-100) <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="ch-text-input"
                          value={rule.threshold}
                          onChange={(e) => updateAiRule(index, 'threshold', e.target.value)}
                        />
                      </div>

                      {/* GPU Jobs Input */}
                      <div className="ch-grid-group col-gpu">
                        <label className="ch-grid-label">
                          GPU Jobs <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="ch-text-input"
                          value={rule.gpuJobs}
                          onChange={(e) => updateAiRule(index, 'gpuJobs', e.target.value)}
                        />
                      </div>

                      {/* Metadata Input */}
                      <div className="ch-grid-group col-metadata">
                        <label className="ch-grid-label">
                          Metadata <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="ch-text-input"
                          value={rule.metadata}
                          onChange={(e) => updateAiRule(index, 'metadata', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ch-form-actions">
                <button
                  type="button"
                  className="ch-btn-cancel"
                  onClick={() => handleCancel('ai-rule')}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="ch-btn-save"
                  onClick={() => handleSave('AI Settings', 'aiRules', aiRules)}
                >
                  Save Configuration
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            PANEL 3: ALERTS
           ======================================================== */}
        <div className={`ch-accordion-item ${activeTab === 'alerts' ? 'active' : ''}`}>
          <div className="ch-accordion-header" onClick={() => handleHeaderClick('alerts')}>
            <img src="/assets/icon_alerts.png" alt="Alert Rules" className="ch-accordion-header-icon" />
            <div className="ch-accordion-header-text">
              <div className="ch-header-title">Alert Rules</div>
              <div className="ch-header-subtitle">Configure the alerts settings</div>
            </div>
          </div>

          {activeTab === 'alerts' && (
            <div className="ch-accordion-body">
              <div className="ch-section-header">
                <div>
                  <h4 className="ch-body-title">Configure Alert Rules</h4>
                  <p className="ch-body-subtitle">Define alert rules and notification preferences.</p>
                </div>
              </div>

              <div className="ch-form-grid">
                <div className="ch-form-group">
                  <label className="ch-field-label">
                    Severity <span className="required">*</span>
                  </label>
                  <div className="ch-field-desc">Select the severity level for the alert .</div>
                  <select
                    className="ch-select-input"
                    value={alertRules.severity}
                    onChange={(e) => setAlertRules((prev) => ({ ...prev, severity: e.target.value }))}
                  >
                    <option value="" disabled>Select Severity</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div className="ch-form-group">
                  <label className="ch-field-label">
                    Escalation <span className="required">*</span>
                  </label>
                  <div className="ch-field-desc">Choose the escalation alert for this alert.</div>
                  <select
                    className="ch-select-input"
                    value={alertRules.escalation}
                    onChange={(e) => setAlertRules((prev) => ({ ...prev, escalation: e.target.value }))}
                  >
                    <option value="" disabled>Select Escalation Level</option>
                    <option>Level 1</option>
                    <option>Level 2</option>
                    <option>Level 3</option>
                  </select>
                </div>

                <div className="ch-form-group">
                  <label className="ch-field-label">
                    Site <span className="required">*</span>
                  </label>
                  <div className="ch-field-desc">Select the site where the alert will be applicable.</div>
                  <select
                    className="ch-select-input"
                    value={alertRules.site}
                    onChange={(e) => setAlertRules((prev) => ({ ...prev, site: e.target.value }))}
                  >
                    <option value="" disabled>Select Site</option>
                    <option>Plant A</option>
                    <option>Plant B</option>
                    <option>Plant C</option>
                  </select>
                </div>

                <div className="ch-form-group">
                  <label className="ch-field-label">
                    Notification <span className="required">*</span>
                  </label>
                  <div className="ch-field-desc">Select the notification channels.</div>
                  <select
                    className="ch-select-input"
                    value={alertRules.notification}
                    onChange={(e) => setAlertRules((prev) => ({ ...prev, notification: e.target.value }))}
                  >
                    <option value="" disabled>Select Notification Channel</option>
                    <option>Email</option>
                    <option>SMS</option>
                    <option>Teams</option>
                  </select>
                </div>

                <div className="ch-form-group">
                  <label className="ch-field-label">
                    Websocket <span className="required">*</span>
                  </label>
                  <div className="ch-field-desc">Enable or disable websocket alerts</div>
                  <select
                    className="ch-select-input"
                    value={alertRules.websocket}
                    onChange={(e) => setAlertRules((prev) => ({ ...prev, websocket: e.target.value }))}
                  >
                    <option value="" disabled>Select Websocket Option</option>
                    <option>Enabled</option>
                    <option>Disabled</option>
                  </select>
                </div>
              </div>

              <div className="ch-form-actions">
                <button
                  type="button"
                  className="ch-btn-cancel"
                  onClick={() => handleCancel('alerts')}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="ch-btn-save"
                  onClick={() => handleSave('Alerts', 'alerts', alertRules)}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            PANEL 4: STREAMING
           ======================================================== */}
        <div className={`ch-accordion-item ${activeTab === 'streaming' ? 'active' : ''}`}>
          <div className="ch-accordion-header" onClick={() => handleHeaderClick('streaming')}>
            <img src="/assets/icon_stream_profiles.png" alt="Stream Profile" className="ch-accordion-header-icon" />
            <div className="ch-accordion-header-text">
              <div className="ch-header-title">Stream Profile</div>
              <div className="ch-header-subtitle">Configure the streaming settings</div>
            </div>
          </div>

          {activeTab === 'streaming' && (
            <div className="ch-accordion-body scroll-hidden">
              <div className="ch-section-header">
                <div>
                  <h4 className="ch-body-title">Stream Profile Configuration</h4>
                  <p className="ch-body-subtitle">Create a new stream profile by providing encoding and quality settings</p>
                </div>
                <button type="button" className="ch-btn-add" onClick={addStreamingProfile}>
                  + Add
                </button>
              </div>

              {/* Scrollable list of profile cards */}
              <div className="ch-scrollable-container">
                {streamProfiles.map((profile, index) => (
                  <div className="ch-profile-card" key={index}>
                    <button
                      type="button"
                      className="ch-card-close-btn"
                      onClick={() => removeStreamingProfile(index)}
                      aria-label="Remove Streaming Profile"
                      title="Remove Streaming Profile"
                    >
                      ✕
                    </button>

                    <div className="ch-profile-grid">
                      {/* Profile Name */}
                      <div className="ch-grid-group ch-col-name">
                        <label className="ch-grid-label">
                          Profile Name <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="ch-text-input"
                          placeholder="Enter profile name"
                          value={profile.profileName}
                          onChange={(e) => updateStreamingProfile(index, 'profileName', e.target.value)}
                        />
                      </div>

                      {/* Stream Quality */}
                      <div className="ch-grid-group col-quality">
                        <label className="ch-grid-label">
                          Stream Quality <span className="required">*</span>
                        </label>
                        <select
                          className="ch-select-input"
                          value={profile.streamQuality}
                          onChange={(e) => updateStreamingProfile(index, 'streamQuality', e.target.value)}
                        >
                          <option value="" disabled>Select Stream Quality</option>
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                        </select>
                      </div>

                      {/* Codec */}
                      <div className="ch-grid-group col-codec">
                        <label className="ch-grid-label">
                          Codec <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="ch-text-input"
                          placeholder="Enter Codec"
                          value={profile.codec}
                          onChange={(e) => updateStreamingProfile(index, 'codec', e.target.value)}
                        />
                      </div>

                      {/* Resolution */}
                      <div className="ch-grid-group col-resolution">
                        <label className="ch-grid-label">
                          Resolution <span className="required">*</span>
                        </label>
                        <select
                          className="ch-select-input"
                          value={profile.resolution}
                          onChange={(e) => updateStreamingProfile(index, 'resolution', e.target.value)}
                        >
                          <option value="" disabled>Select Resolution</option>
                          <option>854×480</option>
                          <option>1280×720</option>
                          <option>1920×1080</option>
                        </select>
                      </div>

                      {/* Bitrate with units suffix */}
                      <div className="ch-grid-group col-bitrate">
                        <label className="ch-grid-label">
                          Bitrate <span className="required">*</span>
                        </label>
                        <div className="ch-input-suffix-wrapper">
                          <input
                            type="text"
                            className="ch-text-input-suffixed"
                            placeholder="Enter Bitrate"
                            value={profile.bitrate}
                            onChange={(e) => updateStreamingProfile(index, 'bitrate', e.target.value)}
                          />
                          <span className="ch-suffix-label">kbps</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ch-form-actions">
                <button
                  type="button"
                  className="ch-btn-cancel"
                  onClick={() => handleCancel('streaming')}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="ch-btn-save"
                  onClick={() => handleSave('Streaming', 'streaming', streamProfiles)}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}