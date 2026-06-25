import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cameraService } from '../../services/cameraService';
import './CameraDetails.css';

export default function CameraDetails({ onClose }) {
  const navigate = useNavigate();

  // Retrieve current editing camera from service
  const [editingCamera, setEditingCameraState] = useState(() => cameraService.getEditingCamera());

  // Subscribe to changes in the camera list (which might update the editing camera)
  useEffect(() => {
    const unsubscribe = cameraService.subscribe(() => {
      // Refresh local editing camera references from service
      const updated = cameraService.getEditingCamera();
      setEditingCameraState(updated ? { ...updated } : null);
    });
    return unsubscribe;
  }, []);

  // Redirect to camera dashboard if no editing camera exists
  useEffect(() => {
    if (!editingCamera) {
      if (onClose) onClose();
      else navigate('/camera-management');
    }
  }, [editingCamera, navigate, onClose]);

  // Card view/edit states
  const [isEditingCameraInfo, setIsEditingCameraInfo] = useState(false);
  const [isEditingLocationInfo, setIsEditingLocationInfo] = useState(false);
  const [isEditingNetworkInfo, setIsEditingNetworkInfo] = useState(false);
  const [isEditingProjectInfo, setIsEditingProjectInfo] = useState(false);
  const [isEditingUseCaseInfo, setIsEditingUseCaseInfo] = useState(false);

  // Form states for inputs
  const [editFormName, setEditFormName] = useState('');
  const [editFormSerial, setEditFormSerial] = useState('');
  const [editFormType, setEditFormType] = useState('Fixed');
  const [editFormStatus, setEditFormStatus] = useState('Online');
  const [editFormDescription, setEditFormDescription] = useState('');

  const [editFormUnitName, setEditFormUnitName] = useState('Unit 1');
  const [editFormLocationDetail, setEditFormLocationDetail] = useState('');

  const [editFormIpAddress, setEditFormIpAddress] = useState('192.168.1.101');
  const [editFormPort, setEditFormPort] = useState('80');

  const [projectDetailsList, setProjectDetailsList] = useState([]);
  const [editFormUseCase, setEditFormUseCase] = useState('');

  // Options
  const cameraTypes = ['Fixed', 'PTZ', 'Dome', 'Bullet'];
  const units = ['Unit 1', 'Unit 2', 'Unit 3'];
  const workNames = ['Plant Surveillance System', 'Work 1', 'Work 2', 'Work 3'];
  const foiLoas = ['LOA/2024/00123', 'FOI-11111', 'FOI-22222', 'FOI-33333'];
  
  const projectDataMap = {
    'Plant Surveillance System': { contractor: 'ABC Constructions Pvt. Ltd.', tenderNo: 'TND/2024/0456' },
    'LOA/2024/00123': { contractor: 'ABC Constructions Pvt. Ltd.', tenderNo: 'TND/2024/0456' },
    'Work 1': { contractor: 'Contractor 1', tenderNo: 'TND-11111' },
    'FOI-11111': { contractor: 'Contractor 1', tenderNo: 'TND-11111' },
    'Work 2': { contractor: 'Contractor 2', tenderNo: 'TND-22222' },
    'FOI-22222': { contractor: 'Contractor 2', tenderNo: 'TND-22222' },
    'Work 3': { contractor: 'Contractor 3', tenderNo: 'TND-33333' },
    'FOI-33333': { contractor: 'Contractor 3', tenderNo: 'TND-33333' }
  };

  const useCases = [
    'PPE (Helmet, Safety Jacket, Safety Shoe) non-compliance detection',
    'Intrusion in restricted zones detection',
    'Absence of barricades/ safety railing',
    'Unsafe working at height',
    'Person falling detection ',
    'No motion/ collapsed/ sleeping person detection',
    'Monitoring of safety during lifting detection',
    'Fire, smoke detection',
    'Camera tampering detection'
  ];

  if (!editingCamera) {
    return null; // Let the redirect useEffect do its work
  }

  const onCloseDetails = () => {
    cameraService.setEditingCamera(null);
    closeAllEditModes();
    if (onClose) onClose();
    else navigate('/camera-management');
  };

  const closeAllEditModes = () => {
    setIsEditingCameraInfo(false);
    setIsEditingLocationInfo(false);
    setIsEditingNetworkInfo(false);
    setIsEditingProjectInfo(false);
    setIsEditingUseCaseInfo(false);
  };

  // --- Section Edit Triggers & Saves ---
  const startEditCameraInfo = () => {
    setEditFormName(editingCamera.name);
    setEditFormSerial(editingCamera.serialNumber || '');
    setEditFormType(editingCamera.type);
    setEditFormStatus(editingCamera.status);
    setEditFormDescription(editingCamera.description || '');
    setIsEditingCameraInfo(true);
  };

  const saveCameraInfo = () => {
    if (!editFormName.trim()) {
      cameraService.showToast('Camera Name is required', 'danger');
      return;
    }
    const updated = {
      ...editingCamera,
      name: editFormName.trim(),
      serialNumber: editFormSerial.trim(),
      type: editFormType,
      status: editFormStatus,
      description: editFormDescription.trim()
    };
    cameraService.updateCamera(updated);
    setIsEditingCameraInfo(false);
    cameraService.showToast('Camera Information updated successfully', 'success');
  };

  const startEditLocationInfo = () => {
    setEditFormUnitName(editingCamera.unitName || 'Unit 1');
    setEditFormLocationDetail(editingCamera.locationDetail || 'Building A');
    setIsEditingLocationInfo(true);
  };

  const saveLocationInfo = () => {
    if (!editFormLocationDetail.trim()) {
      cameraService.showToast('Location is required', 'danger');
      return;
    }
    const updated = {
      ...editingCamera,
      unitName: editFormUnitName,
      locationDetail: editFormLocationDetail.trim(),
      location: `${editFormUnitName}, ${editFormLocationDetail.trim()}, Ground Floor`
    };
    cameraService.updateCamera(updated);
    setIsEditingLocationInfo(false);
    cameraService.showToast('Location details updated successfully', 'success');
  };

  const startEditNetworkInfo = () => {
    setEditFormIpAddress(editingCamera.ipAddress || '192.168.1.101');
    setEditFormPort(editingCamera.port || '80');
    setIsEditingNetworkInfo(true);
  };

  const saveNetworkInfo = () => {
    if (!editFormIpAddress.trim() || !editFormPort.trim()) {
      cameraService.showToast('IP Address and Port are required', 'danger');
      return;
    }
    const updated = {
      ...editingCamera,
      ipAddress: editFormIpAddress.trim(),
      port: editFormPort.trim()
    };
    cameraService.updateCamera(updated);
    setIsEditingNetworkInfo(false);
    cameraService.showToast('Network / IP configuration updated successfully', 'success');
  };

  const getParsedProjectDetailsList = (cam) => {
    if (!cam) return [];
    let list = [];
    try {
      if (cam.foiLoaNo && (cam.foiLoaNo.startsWith('[') || cam.foiLoaNo.startsWith('{'))) {
        list = JSON.parse(cam.foiLoaNo);
      }
    } catch (e) {
      // ignore
    }

    if (!Array.isArray(list) || list.length === 0) {
      list = [
        {
          workName: cam.nameOfWork || '',
          foiEntries: [
            {
              foiLoaNo: cam.foiLoaNo || '',
              contractor: cam.contractor || '',
              tenderNo: cam.tenderNo || ''
            }
          ]
        }
      ];
    }

    list.forEach((item) => {
      if (!item.foiEntries || !Array.isArray(item.foiEntries)) {
        if (item.foiLoaNos && Array.isArray(item.foiLoaNos)) {
          item.foiEntries = item.foiLoaNos.map((foi) => ({
            foiLoaNo: foi,
            contractor: item.contractor || '',
            tenderNo: item.tenderNo || ''
          }));
        } else {
          item.foiEntries = [
            {
              foiLoaNo: item.foiLoaNo || '',
              contractor: item.contractor || '',
              tenderNo: item.tenderNo || ''
            }
          ];
        }
      }
    });

    return list;
  };

  const startEditProjectInfo = () => {
    const list = getParsedProjectDetailsList(editingCamera);
    setProjectDetailsList(list);
    setIsEditingProjectInfo(true);
  };

  const saveProjectInfo = () => {
    const serialized = JSON.stringify(projectDetailsList);
    
    const firstProj = projectDetailsList[0] || {};
    const firstWorkName = firstProj.workName || '';
    const firstFoiEntries = firstProj.foiEntries || [];
    const firstFoiEntry = firstFoiEntries[0] || {};
    const firstFoiLoa = firstFoiEntry.foiLoaNo || '';
    const firstContractor = firstFoiEntry.contractor || '';
    const firstTenderNo = firstFoiEntry.tenderNo || '';

    const updated = {
      ...editingCamera,
      nameOfWork: firstWorkName,
      foiLoaNo: serialized,
      contractor: firstContractor,
      tenderNo: firstTenderNo
    };

    cameraService.updateCamera(updated);
    setIsEditingProjectInfo(false);
    cameraService.showToast('Project and Work details updated successfully', 'success');
  };

  const duplicateProjectDetail = () => {
    if (projectDetailsList.length > 0) {
      const last = projectDetailsList[projectDetailsList.length - 1];
      setProjectDetailsList([
        ...projectDetailsList,
        {
          workName: last.workName,
          foiEntries: last.foiEntries.map((e) => ({ ...e }))
        }
      ]);
    } else {
      setProjectDetailsList([
        {
          workName: '',
          foiEntries: [{ foiLoaNo: '', contractor: '', tenderNo: '' }]
        }
      ]);
    }
  };

  const removeProjectDetail = (pIdx) => {
    if (projectDetailsList.length > 1) {
      setProjectDetailsList(projectDetailsList.filter((_, idx) => idx !== pIdx));
    } else {
      setProjectDetailsList([
        {
          workName: '',
          foiEntries: [{ foiLoaNo: '', contractor: '', tenderNo: '' }]
        }
      ]);
    }
  };

  const getContractorTenderValue = (workName, foiLoaNo) => {
    let mapping = null;
    if (foiLoaNo && projectDataMap[foiLoaNo]) {
      mapping = projectDataMap[foiLoaNo];
    } else if (workName && projectDataMap[workName]) {
      mapping = projectDataMap[workName];
    }
    return mapping || { contractor: '', tenderNo: '' };
  };

  const addFoiLoa = (pIdx) => {
    const list = [...projectDetailsList];
    const proj = { ...list[pIdx] };
    const mapping = getContractorTenderValue(proj.workName, '');
    
    proj.foiEntries = [
      ...proj.foiEntries,
      { foiLoaNo: '', contractor: mapping.contractor, tenderNo: mapping.tenderNo }
    ];

    list[pIdx] = proj;
    setProjectDetailsList(list);
  };

  const removeFoiLoa = (pIdx, fIdx) => {
    const list = [...projectDetailsList];
    const proj = { ...list[pIdx] };
    
    if (proj.foiEntries.length > 1) {
      proj.foiEntries = proj.foiEntries.filter((_, idx) => idx !== fIdx);
    }
    
    list[pIdx] = proj;
    setProjectDetailsList(list);
  };

  const onWorkNameChange = (pIdx, workName) => {
    const list = [...projectDetailsList];
    const proj = { ...list[pIdx], workName };
    
    proj.foiEntries = proj.foiEntries.map((entry) => {
      const mapping = getContractorTenderValue(workName, entry.foiLoaNo);
      return {
        ...entry,
        contractor: mapping.contractor,
        tenderNo: mapping.tenderNo
      };
    });

    list[pIdx] = proj;
    setProjectDetailsList(list);
  };

  const onFoiLoaChange = (pIdx, fIdx, foiLoaNo) => {
    const list = [...projectDetailsList];
    const proj = { ...list[pIdx] };
    const foiArray = [...proj.foiEntries];
    
    const mapping = getContractorTenderValue(proj.workName, foiLoaNo);
    foiArray[fIdx] = {
      foiLoaNo,
      contractor: mapping.contractor,
      tenderNo: mapping.tenderNo
    };

    proj.foiEntries = foiArray;
    list[pIdx] = proj;
    setProjectDetailsList(list);
  };

  const startEditUseCaseInfo = () => {
    setEditFormUseCase(editingCamera.useCase || '');
    setIsEditingUseCaseInfo(true);
  };

  const saveUseCaseInfo = () => {
    const updated = {
      ...editingCamera,
      useCase: editFormUseCase
    };
    cameraService.updateCamera(updated);
    setIsEditingUseCaseInfo(false);
    cameraService.showToast('Use Case configuration updated successfully', 'success');
  };

  const onUpdateAllDetails = () => {
    cameraService.showToast('Camera details updated successfully', 'success');
    if (onClose) onClose();
    else navigate('/camera-management');
  };

  const onDeleteFromDetails = () => {
    cameraService.setEditingCamera(null);
    closeAllEditModes();
    cameraService.setDeletingCamera(editingCamera);
    if (onClose) onClose();
    else navigate('/camera-management');
  };

  const viewProjectList = getParsedProjectDetailsList(editingCamera);

  // --- Popup Render Helpers ---
  const renderCameraInfoEditForm = () => {
    return (
      <div className="details-edit-form">
        <div className="form-grid four-col">
          <div className="form-group">
            <label>Camera Name <span className="required">*</span></label>
            <input
              type="text"
              value={editFormName}
              onChange={(e) => setEditFormName(e.target.value)}
              placeholder="Enter Camera Name"
              className="form-textbox"
            />
          </div>
          <div className="form-group">
            <label>Serial Number</label>
            <input
              type="text"
              value={editFormSerial}
              onChange={(e) => setEditFormSerial(e.target.value)}
              placeholder="Enter Serial Number"
              className="form-textbox"
            />
          </div>
          <div className="form-group">
            <label>Camera Type <span className="required">*</span></label>
            <select
              value={editFormType}
              onChange={(e) => setEditFormType(e.target.value)}
              className="form-select"
            >
              {cameraTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Status <span className="required">*</span></label>
            <div className="status-select-wrapper">
              <span className="status-dot-indicator" style={{ backgroundColor: editFormStatus === 'Online' ? '#10b981' : '#ef4444' }}></span>
              <select
                value={editFormStatus}
                onChange={(e) => setEditFormStatus(e.target.value)}
                className="form-select status-select-padded"
              >
                <option value="Online">Active</option>
                <option value="Offline">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="camera-info-bottom-row">
          <div className="form-group camera-desc-field">
            <label>Description</label>
            <input
              type="text"
              value={editFormDescription}
              onChange={(e) => setEditFormDescription(e.target.value)}
              placeholder="Enter Description (optional)"
              className="form-textbox"
            />
          </div>
          <div className="form-actions-inline">
            <button className="btn-card-cancel" onClick={closeAllEditModes}>Cancel</button>
            <button className="btn-card-save" onClick={saveCameraInfo}>Save Changes</button>
          </div>
        </div>
      </div>
    );
  };

  const renderLocationInfoEditForm = () => {
    return (
      <div className="details-edit-form-row">
        <div className="form-group field-unit">
          <label>Unit Name <span className="required">*</span></label>
          <select
            value={editFormUnitName}
            onChange={(e) => setEditFormUnitName(e.target.value)}
            className="form-select"
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
        <div className="form-group field-loc">
          <label>Location <span className="required">*</span></label>
          <input
            type="text"
            value={editFormLocationDetail}
            onChange={(e) => setEditFormLocationDetail(e.target.value)}
            placeholder="Enter Location"
            className="form-textbox"
          />
        </div>
        <div className="form-actions-inline">
          <button className="btn-card-cancel" onClick={closeAllEditModes}>Cancel</button>
          <button className="btn-card-save" onClick={saveLocationInfo}>Save Changes</button>
        </div>
      </div>
    );
  };

  const renderNetworkInfoEditForm = () => {
    return (
      <div className="details-edit-form-row">
        <div className="form-group field-loc">
          <label>IP Address <span className="required">*</span></label>
          <input
            type="text"
            value={editFormIpAddress}
            onChange={(e) => setEditFormIpAddress(e.target.value)}
            placeholder="Enter IP address"
            className="form-textbox"
          />
        </div>
        <div className="form-group field-loc">
          <label>Port <span className="required">*</span></label>
          <input
            type="text"
            value={editFormPort}
            onChange={(e) => setEditFormPort(e.target.value)}
            placeholder="Enter Port"
            className="form-textbox"
          />
        </div>
        <div className="form-actions-inline">
          <button className="btn-card-cancel" onClick={closeAllEditModes}>Cancel</button>
          <button className="btn-card-save" onClick={saveNetworkInfo}>Save Changes</button>
        </div>
      </div>
    );
  };

  const renderProjectInfoEditForm = () => {
    return (
      <div className="details-edit-form">
        {projectDetailsList.map((item, pIdx) => (
          <div key={pIdx} className="project-detail-edit-block" style={{ borderBottom: projectDetailsList.length > 1 ? '1px dashed #cbd5e1' : 'none', paddingBottom: projectDetailsList.length > 1 ? '1.5rem' : '0' }}>
            {projectDetailsList.length > 1 && (
              <div className="project-block-header">
                <span className="project-block-title">Project / Work Details #{pIdx + 1}</span>
                <button type="button" className="btn-remove-project" onClick={() => removeProjectDetail(pIdx)}>✕ Remove</button>
              </div>
            )}

            <div className="form-grid four-col">
              <div className="form-group">
                <label>Name of Work <span className="required">*</span></label>
                <select
                  value={item.workName}
                  onChange={(e) => onWorkNameChange(pIdx, e.target.value)}
                  className="form-select"
                >
                  <option value="" disabled>Select Work</option>
                  {workNames.map((work) => (
                    <option key={work} value={work}>{work}</option>
                  ))}
                </select>
              </div>

              {item.foiEntries.map((foi, fIdx) => (
                <React.Fragment key={fIdx}>
                  <div className="form-group">
                    {fIdx === 0 && <label>FOI / LOA No <span className="required">*</span></label>}
                    <select
                      value={foi.foiLoaNo}
                      onChange={(e) => onFoiLoaChange(pIdx, fIdx, e.target.value)}
                      className="form-select"
                    >
                      <option value="" disabled>Select FOI / LOA number</option>
                      {foiLoas.map((foiOption) => (
                        <option key={foiOption} value={foiOption}>{foiOption}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    {fIdx === 0 && <label>Contractor</label>}
                    <input
                      type="text"
                      value={foi.contractor}
                      readOnly
                      placeholder="Auto-filled by system"
                      className="form-textbox readonly-input"
                    />
                  </div>

                  <div className="form-group">
                    {fIdx === 0 && <label>Tender No</label>}
                    <input
                      type="text"
                      value={foi.tenderNo}
                      readOnly
                      placeholder="Auto-filled by system"
                      className="form-textbox readonly-input"
                    />
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}

        <div className="project-actions-row-edit" style={{ borderTop: 'none', paddingTop: 0 }}>
          <button type="button" className="btn-add-more" onClick={duplicateProjectDetail}>+ Add More</button>
          <div className="right-actions">
            <button className="btn-card-cancel" onClick={closeAllEditModes}>Cancel</button>
            <button className="btn-card-save" onClick={saveProjectInfo}>Save Changes</button>
          </div>
        </div>
      </div>
    );
  };

  const renderUseCaseInfoEditForm = () => {
    return (
      <div className="details-edit-form-row">
        <div className="form-group" style={{ flex: 1, maxWidth: '55%' }}>
          <label>Use Cases <span className="required">*</span></label>
          <select
            value={editFormUseCase}
            onChange={(e) => setEditFormUseCase(e.target.value)}
            className="form-select"
            style={{ width: '100%' }}
          >
            <option value="">Select use case</option>
            {useCases.map((uc) => (
              <option key={uc} value={uc}>{uc}</option>
            ))}
          </select>
        </div>
        <div className="form-actions-inline">
          <button className="btn-card-cancel" onClick={closeAllEditModes}>Cancel</button>
          <button className="btn-card-save" onClick={saveUseCaseInfo}>Save Changes</button>
        </div>
      </div>
    );
  };



  return (
    <div className="camera-details-container">
      {/* Details Panel Header */}
      <div className="details-header-bar">
        <div className="details-header-left">
          <h1 className="details-title">Camera Details</h1>
          <p className="details-subtitle">View and Update Camera Information</p>
        </div>
        <button type="button" className="close-btn" onClick={onCloseDetails} aria-label="Close">
          ✕
        </button>
      </div>

      {/* Details Summary Card */}
      <div className="details-summary-card">
        <div className="summary-left">
          <div className="summary-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="summary-camera-svg">
              <path d="M23 7l-7 5 7 5V7z"></path>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
          </div>
          <div className="summary-info">
            <h2 className="summary-name">{editingCamera.name}</h2>
            <p className="summary-desc">
              {editingCamera.unitName || 'Unit 1'}, {editingCamera.locationDetail || 'Building A'}, Ground Floor
            </p>
          </div>
        </div>
        <div className="summary-right">
          <span className={`summary-status-badge ${editingCamera.status === 'Online' ? 'badge-online' : 'badge-offline'}`}>
            <span className="summary-status-dot"></span>
            {editingCamera.status || 'Online'}
          </span>
        </div>
      </div>

      {/* Accordion Cards stack */}
      <div className="camera-details-scrollable">
        <div className="details-stack">
        
        {/* Card 1: Camera Information */}
        <section className="section-card">
          <div className="section-header-row">
            <div className="section-title-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="section-icon">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <h2>Camera Information</h2>
            </div>
            {isEditingCameraInfo ? (
              <button className="btn-section-collapse" onClick={closeAllEditModes} aria-label="Close edit mode">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </button>
            ) : (
              <button className="btn-card-edit" onClick={startEditCameraInfo}>
                <img src="/assets/icon_edit.png" alt="Edit" style={{ width: '13px', height: '13px', marginRight: '6px' }} />
                Edit
              </button>
            )}
          </div>

          <div className="section-body">
            {isEditingCameraInfo ? (
              renderCameraInfoEditForm()
            ) : (
              <div className="details-view-grid">
                <div className="detail-item">
                  <span className="detail-label">Camera Name <span className="required">*</span></span>
                  <span className="detail-value text-dark" style={{ fontWeight: 500 }}>{editingCamera.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Serial Number</span>
                  <span className="detail-value text-dark">{editingCamera.serialNumber || 'SN1234567890'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Camera Type <span className="required">*</span></span>
                  <span className="detail-value text-dark">{editingCamera.type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status <span className="required">*</span></span>
                  <div className="detail-status-inline">
                    <span className="detail-status-dot" style={{ backgroundColor: editingCamera.status === 'Online' ? '#10b981' : '#ef4444' }}></span>
                    <span className="detail-value text-dark" style={{ fontWeight: 500 }}>
                      {editingCamera.status === 'Online' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="detail-item span-full">
                  <span className="detail-label">Description</span>
                  <span className="detail-value text-dark">{editingCamera.description || 'N/A'}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Card 2: Location Details */}
        <section className="section-card">
          <div className="section-header-row">
            <div className="section-title-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="section-icon">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <h2>Location Details</h2>
            </div>
            {isEditingLocationInfo ? (
              <button className="btn-section-collapse" onClick={closeAllEditModes} aria-label="Close edit mode">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </button>
            ) : (
              <button className="btn-card-edit" onClick={startEditLocationInfo}>
                <img src="/assets/icon_edit.png" alt="Edit" style={{ width: '13px', height: '13px', marginRight: '6px' }} />
                Edit
              </button>
            )}
          </div>

          <div className="section-body">
            {isEditingLocationInfo ? (
              renderLocationInfoEditForm()
            ) : (
              <div className="details-view-grid">
                <div className="detail-item">
                  <span className="detail-label">Unit Name <span className="required">*</span></span>
                  <span className="detail-value text-dark">{editingCamera.unitName || 'Unit 1'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location <span className="required">*</span></span>
                  <span className="detail-value text-dark">{editingCamera.locationDetail || 'Building A'}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Card 3: Network / IP Configuration */}
        <section className="section-card">
          <div className="section-header-row">
            <div className="section-title-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" className="section-icon">
                <rect x="16" y="16" width="6" height="6" rx="1"></rect>
                <rect x="2" y="16" width="6" height="6" rx="1"></rect>
                <rect x="9" y="2" width="6" height="6" rx="1"></rect>
                <path d="M12 8v8M5 16v-4h14v4"></path>
              </svg>
              <h2>Network / IP Configuration</h2>
            </div>
            {isEditingNetworkInfo ? (
              <button className="btn-section-collapse" onClick={closeAllEditModes} aria-label="Close edit mode">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </button>
            ) : (
              <button className="btn-card-edit" onClick={startEditNetworkInfo}>
                <img src="/assets/icon_edit.png" alt="Edit" style={{ width: '13px', height: '13px', marginRight: '6px' }} />
                Edit
              </button>
            )}
          </div>

          <div className="section-body">
            {isEditingNetworkInfo ? (
              renderNetworkInfoEditForm()
            ) : (
              <div className="details-view-grid">
                <div className="detail-item">
                  <span className="detail-label">IP Address <span className="required">*</span></span>
                  <span className="detail-value text-dark">{editingCamera.ipAddress || '192.168.1.101'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Port <span className="required">*</span></span>
                  <span className="detail-value text-dark">{editingCamera.port || '80'}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Card 4: Project / Work Details */}
        <section className="section-card">
          <div className="section-header-row">
            <div className="section-title-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" className="section-icon">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              <h2>Project / Work Details</h2>
            </div>
            {isEditingProjectInfo ? (
              <button className="btn-section-collapse" onClick={closeAllEditModes} aria-label="Close edit mode">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </button>
            ) : (
              <button className="btn-card-edit" onClick={startEditProjectInfo}>
                <img src="/assets/icon_edit.png" alt="Edit" style={{ width: '13px', height: '13px', marginRight: '6px' }} />
                Edit
              </button>
            )}
          </div>

          <div className="section-body">
            {isEditingProjectInfo ? (
              renderProjectInfoEditForm()
            ) : (
              viewProjectList.map((project, pIdx) => (
                <div key={pIdx} className="project-detail-view-block">
                  {viewProjectList.length > 1 && (
                    <div className="project-view-block-header">
                      <h3>Project / Work Details #{pIdx + 1}</h3>
                    </div>
                  )}
                  <div className="details-view-grid">
                    <div className="detail-item">
                      <span className="detail-label">Name of Work <span className="required">*</span></span>
                      <span className="detail-value text-dark">{project.workName || 'N/A'}</span>
                    </div>

                    <div className="foi-view-entries-span">
                      {project.foiEntries.map((entry, fIdx) => (
                        <div key={fIdx} className="foi-view-entry-row">
                          <div className="detail-item">
                            <span className="detail-label">FOI / LOA No <span className="required">*</span></span>
                            <span className="detail-value text-dark">{entry.foiLoaNo || 'N/A'}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Contractor</span>
                            <span className="detail-value text-dark">{entry.contractor || 'N/A'}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Tender No</span>
                            <span className="detail-value text-dark">{entry.tenderNo || 'N/A'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {pIdx < viewProjectList.length - 1 && <hr className="project-block-divider" />}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Card 5: Use Case Configuration */}
        <section className="section-card">
          <div className="section-header-row">
            <div className="section-title-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" className="section-icon">
                <path d="M3 12h4l2-6 4 12 2-6h6"></path>
              </svg>
              <h2>Use Case Configuration</h2>
            </div>
            {isEditingUseCaseInfo ? (
              <button className="btn-section-collapse" onClick={closeAllEditModes} aria-label="Close edit mode">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </button>
            ) : (
              <button className="btn-card-edit" onClick={startEditUseCaseInfo}>
                <img src="/assets/icon_edit.png" alt="Edit" style={{ width: '13px', height: '13px', marginRight: '6px' }} />
                Edit
              </button>
            )}
          </div>

          <div className="section-body">
            {isEditingUseCaseInfo ? (
              renderUseCaseInfoEditForm()
            ) : (
              <div className="details-view-grid">
                <div className="detail-item span-full">
                  <span className="detail-label">Use Cases <span className="required">*</span></span>
                  <span className="detail-value text-dark" style={{ whiteSpace: 'normal' }}>
                    {editingCamera.useCase || 'N/A'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="details-footer-bar">
        <button className="btn-footer-close" onClick={onCloseDetails}>Close</button>
        <div className="details-footer-right">
          <button className="btn-footer-update" onClick={onUpdateAllDetails}>
            <img src="/assets/icon_edit.png" alt="Update" style={{ width: '13px', height: '13px', marginRight: '6px' }} />
            Update
          </button>
          <button className="btn-footer-delete" onClick={onDeleteFromDetails}>
            <img src="/assets/icon_delete.png" alt="Delete" style={{ width: '13px', height: '13px', marginRight: '6px' }} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

