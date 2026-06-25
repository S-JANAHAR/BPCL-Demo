import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cameraService } from '../../services/cameraService';
import './AddCamera.css';

export default function AddCamera({ onClose }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cameraName: '',
    serialNumber: '',
    cameraType: '',
    status: 'Active',
    description: '',
    unitName: '',
    location: '',
    ipAddress: '',
    port: '',
    projectDetails: [
      {
        workName: '',
        foiEntries: [{ foiLoaNo: '', contractor: '', tenderNo: '' }]
      }
    ],
    useCase: ''
  });

  const [sections, setSections] = useState({
    camera: true,
    location: false,
    network: false,
    project: false,
    useCase: false
  });

  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const cameraTypes = ['Fixed', 'PTZ', 'Dome', 'Bullet'];
  const statusOptions = ['Active', 'Inactive'];
  const units = ['Unit 1', 'Unit 2', 'Unit 3'];
  const locations = ['Location 1', 'Location 2', 'Location 3'];
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

  const toggleSection = (section) => {
    setSections((prev) => {
      const isOpen = prev[section];
      return {
        camera: false,
        location: false,
        network: false,
        project: false,
        useCase: false,
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
    if (!formData.cameraName.trim()) errs.cameraName = 'Camera Name is required';
    if (!formData.cameraType) errs.cameraType = 'Camera Type is required';
    if (!formData.unitName) errs.unitName = 'Unit Name is required';
    if (!formData.location.trim()) errs.location = 'Location is required';
    if (!formData.ipAddress.trim()) errs.ipAddress = 'IP Address is required';
    if (!formData.port.trim()) errs.port = 'Port is required';
    return errs;
  };

  const errors = getErrors();

  const getContractorTenderValue = (workName, foiLoaNo) => {
    let mapping = null;
    if (foiLoaNo && projectDataMap[foiLoaNo]) {
      mapping = projectDataMap[foiLoaNo];
    } else if (workName && projectDataMap[workName]) {
      mapping = projectDataMap[workName];
    }
    return mapping || { contractor: '', tenderNo: '' };
  };

  const onWorkNameChange = (pIdx, workName) => {
    setFormData((prev) => {
      const details = [...prev.projectDetails];
      const proj = { ...details[pIdx], workName };

      proj.foiEntries = proj.foiEntries.map((entry) => {
        const mapping = getContractorTenderValue(workName, entry.foiLoaNo);
        return {
          ...entry,
          contractor: mapping.contractor,
          tenderNo: mapping.tenderNo
        };
      });

      details[pIdx] = proj;
      return { ...prev, projectDetails: details };
    });
  };

  const onFoiLoaChange = (pIdx, fIdx, foiLoaNo) => {
    setFormData((prev) => {
      const details = [...prev.projectDetails];
      const proj = { ...details[pIdx] };
      const foiArray = [...proj.foiEntries];

      const mapping = getContractorTenderValue(proj.workName, foiLoaNo);
      foiArray[fIdx] = {
        foiLoaNo,
        contractor: mapping.contractor,
        tenderNo: mapping.tenderNo
      };

      proj.foiEntries = foiArray;
      details[pIdx] = proj;
      return { ...prev, projectDetails: details };
    });
  };

  const addFoiLoa = (pIdx) => {
    setFormData((prev) => {
      const details = [...prev.projectDetails];
      const proj = { ...details[pIdx] };

      const mapping = getContractorTenderValue(proj.workName, '');
      const newEntry = {
        foiLoaNo: '',
        contractor: mapping.contractor,
        tenderNo: mapping.tenderNo
      };

      proj.foiEntries = [...proj.foiEntries, newEntry];
      details[pIdx] = proj;
      return { ...prev, projectDetails: details };
    });
  };

  const removeFoiLoa = (pIdx, fIdx) => {
    setFormData((prev) => {
      const details = [...prev.projectDetails];
      const proj = { ...details[pIdx] };

      if (proj.foiEntries.length > 1) {
        proj.foiEntries = proj.foiEntries.filter((_, idx) => idx !== fIdx);
      }

      details[pIdx] = proj;
      return { ...prev, projectDetails: details };
    });
  };

  const duplicateProjectDetail = () => {
    setFormData((prev) => {
      const details = [...prev.projectDetails];
      const lastGroup = details[details.length - 1];

      let newProj;
      if (lastGroup) {
        newProj = {
          workName: lastGroup.workName,
          foiEntries: lastGroup.foiEntries.map((e) => ({ ...e }))
        };
      } else {
        newProj = {
          workName: '',
          foiEntries: [{ foiLoaNo: '', contractor: '', tenderNo: '' }]
        };
      }

      return { ...prev, projectDetails: [...details, newProj] };
    });
  };

  const removeProjectDetail = (pIdx) => {
    setFormData((prev) => {
      let details = [...prev.projectDetails];
      if (details.length > 1) {
        details = details.filter((_, idx) => idx !== pIdx);
      } else {
        details = [
          {
            workName: '',
            foiEntries: [{ foiLoaNo: '', contractor: '', tenderNo: '' }]
          }
        ];
      }
      return { ...prev, projectDetails: details };
    });
  };

  const closePage = () => {
    if (onClose) onClose();
    else navigate('/camera-management');
  };

  const cancel = () => {
    if (onClose) onClose();
    else navigate('/camera-management');
  };

  const saveDraft = () => {
    console.log('Draft saved:', formData);
    cameraService.showToast('Draft saved successfully', 'info');
    if (onClose) onClose();
    else navigate('/camera-management');
  };

  const addCamera = () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) {
      // Mark all fields as touched to display errors
      const allTouched = {};
      Object.keys(errors).forEach((k) => {
        allTouched[k] = true;
      });
      setTouched(allTouched);

      // Auto-expand the first section with errors, closing others
      if (errors.cameraName || errors.cameraType) {
        setSections({ camera: true, location: false, network: false, project: false, useCase: false });
      } else if (errors.unitName || errors.location) {
        setSections({ camera: false, location: true, network: false, project: false, useCase: false });
      } else if (errors.ipAddress || errors.port) {
        setSections({ camera: false, location: false, network: true, project: false, useCase: false });
      }
      return;
    }

    // Generate sequential ID
    const nextIndex = cameraService.getCameras().length + 1;
    const id = `1A0B${nextIndex}CDTYO`;

    // Map status 'Active' -> 'Online', 'Inactive' -> 'Offline'
    const status = formData.status === 'Active' ? 'Online' : 'Offline';

    // Form derived location
    const location = `${formData.unitName}, ${formData.location}, Ground Floor`;

    const projectDetailsList = formData.projectDetails || [];
    const serializedProjectDetails = JSON.stringify(projectDetailsList);

    const firstProj = projectDetailsList[0] || {};
    const firstWorkName = firstProj.workName || '';
    const firstFoiEntries = firstProj.foiEntries || [];
    const firstFoiEntry = firstFoiEntries[0] || {};
    const firstFoiLoa = firstFoiEntry.foiLoaNo || '';
    const firstContractor = firstFoiEntry.contractor || '';
    const firstTenderNo = firstFoiEntry.tenderNo || '';

    const newCamera = {
      id,
      name: formData.cameraName,
      location,
      status,
      type: formData.cameraType,
      serialNumber: formData.serialNumber || '',
      description: formData.description || '',
      unitName: formData.unitName,
      locationDetail: formData.location,
      ipAddress: formData.ipAddress,
      port: formData.port,
      nameOfWork: firstWorkName,
      foiLoaNo: serializedProjectDetails,
      contractor: firstContractor,
      tenderNo: firstTenderNo,
      useCase: formData.useCase || ''
    };

    cameraService.addCamera(newCamera);
    if (onClose) onClose();
    else navigate('/camera-management');
  };

  const isInvalid = (field) => {
    return errors[field] && (touched[field] || submitted);
  };

  return (
    <div className="add-camera-page">
      <div className="page-header">
        <div className="page-header-left">
  <div className="header-title-with-icon">
    
    <span className="header-icon">
      <svg viewBox="0 0 24 24" width="22" height="22"         fill="currentColor"  stroke="currentColor" strokeWidth="2">
        <path d="M23 7l-7 5 7 5V7z"></path>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
      </svg>
    </span>

    <h1>Add Camera</h1>
  </div>

  <p>Enter camera details and location information</p>
</div>

        <button type="button" className="close-btn" onClick={closePage} aria-label="Close">
          ✕
        </button>
      </div>

      <form className="camera-form" onSubmit={(e) => e.preventDefault()}>
        <div className="camera-form-scrollable">
          {/* Camera Information */}
          <section className="section-card">
            <div className="section-header" onClick={() => toggleSection('camera')}>
              <div className="section-title-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="section-icon">
                  <path d="M23 7l-7 5 7 5V7z"></path>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                <h2>Camera Information</h2>
              </div>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`chevron-arrow ${!sections.camera ? 'rotate' : ''}`}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            {sections.camera && (
              <div className="section-body">
                <div className="form-grid four-col">
                  <div className="form-group">
                    <label>Camera Name <span className="required-asterisk">*</span></label>
                    <input
                      type="text"
                      name="cameraName"
                      value={formData.cameraName}
                      onChange={handleChange}
                      onBlur={() => handleBlur('cameraName')}
                      placeholder="Enter Camera Name"
                    />
                    {isInvalid('cameraName') && <small className="error">{errors.cameraName}</small>}
                  </div>

                  <div className="form-group">
                    <label>Serial Number</label>
                    <input
                      type="text"
                      name="serialNumber"
                      value={formData.serialNumber}
                      onChange={handleChange}
                      placeholder="Enter Serial Number"
                    />
                  </div>

                  <div className="form-group">
                    <label>Camera Type <span className="required-asterisk">*</span></label>
                    <select
                      name="cameraType"
                      value={formData.cameraType}
                      onChange={handleChange}
                      onBlur={() => handleBlur('cameraType')}
                    >
                      <option value="" disabled>Select type</option>
                      {cameraTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {isInvalid('cameraType') && <small className="error">{errors.cameraType}</small>}
                  </div>

                  <div className="form-group">
                    <label>Status <span className="required-asterisk">*</span></label>
                    <div className="status-select-wrapper">
                      <span
                        className="status-dot-indicator"
                        style={{ backgroundColor: formData.status === 'Active' ? '#10b981' : '#ef4444' }}
                      ></span>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="status-select-padded"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group span-two-cols" style={{ gridColumn: 'span 2' }}>
                    <label>Description</label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter Description (optional)"
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Location Details */}
          <section className="section-card">
            <div className="section-header" onClick={() => toggleSection('location')}>
              <div className="section-title-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="section-icon">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <h2>Location Details</h2>
              </div>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`chevron-arrow ${!sections.location ? 'rotate' : ''}`}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            {sections.location && (
              <div className="section-body">
                <div className="form-grid four-col">
                  <div className="form-group">
                    <label>Unit Name <span className="required-asterisk">*</span></label>
                    <select
                      name="unitName"
                      value={formData.unitName}
                      onChange={handleChange}
                      onBlur={() => handleBlur('unitName')}
                    >
                      <option value="" disabled>Select Unit</option>
                      {units.map((unit) => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                    {isInvalid('unitName') && <small className="error">{errors.unitName}</small>}
                  </div>

                  <div className="form-group">
                    <label>Location <span className="required-asterisk">*</span></label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      onBlur={() => handleBlur('location')}
                      placeholder="Enter Location"
                    />
                    {isInvalid('location') && <small className="error">{errors.location}</small>}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Network / IP Configuration */}
          <section className="section-card">
            <div className="section-header" onClick={() => toggleSection('network')}>
              <div className="section-title-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="section-icon">
                  <rect x="16" y="16" width="6" height="6" rx="1"></rect>
                  <rect x="2" y="16" width="6" height="6" rx="1"></rect>
                  <rect x="9" y="2" width="6" height="6" rx="1"></rect>
                  <path d="M12 8v8M5 16v-4h14v4"></path>
                </svg>
                <h2>Network / IP Configuration</h2>
              </div>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`chevron-arrow ${!sections.network ? 'rotate' : ''}`}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            {sections.network && (
              <div className="section-body">
                <div className="form-grid four-col">
                  <div className="form-group">
                    <label>IP Address <span className="required-asterisk">*</span></label>
                    <input
                      type="text"
                      name="ipAddress"
                      value={formData.ipAddress}
                      onChange={handleChange}
                      onBlur={() => handleBlur('ipAddress')}
                      placeholder="Enter IP address"
                    />
                    {isInvalid('ipAddress') && <small className="error">{errors.ipAddress}</small>}
                  </div>

                  <div className="form-group">
                    <label>Port</label>
                    <input
                      type="text"
                      name="port"
                      value={formData.port}
                      onChange={handleChange}
                      onBlur={() => handleBlur('port')}
                      placeholder="Enter Port"
                    />
                    {isInvalid('port') && <small className="error">{errors.port}</small>}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Project / Work Details */}
          <section className="section-card">
            <div className="section-header" onClick={() => toggleSection('project')}>
              <div className="section-title-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="section-icon">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                <h2>Project / Work Details</h2>
              </div>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`chevron-arrow ${!sections.project ? 'rotate' : ''}`}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            {sections.project && (
              <div className="section-body">
                {formData.projectDetails.map((projectGroup, pIdx) => (
                  <div key={pIdx} className="project-detail-block">
                    {formData.projectDetails.length > 1 && (
                      <div className="project-block-header">
                        <span className="project-block-title">Project / Work Details #{pIdx + 1}</span>
                        <button type="button" className="btn-remove-project" onClick={() => removeProjectDetail(pIdx)}>✕ Remove</button>
                      </div>
                    )}

                    <div className="form-grid four-col">
                      <div className="form-group">
                        <label>Name of Work <span className="required-asterisk">*</span></label>
                        <select
                          value={projectGroup.workName}
                          onChange={(e) => onWorkNameChange(pIdx, e.target.value)}
                        >
                          <option value="" disabled>Select Work</option>
                          {workNames.map((work) => (
                            <option key={work} value={work}>{work}</option>
                          ))}
                        </select>
                      </div>

                      {projectGroup.foiEntries.map((foiGroup, fIdx) => (
                        <React.Fragment key={fIdx}>
                          {/* Spacer for Column 1 on subsequent rows */}
                          {fIdx > 0 && <div className="grid-spacer-col"></div>}

                          <div className="form-group">
                            {fIdx === 0 && <label>FOI / LOA No <span className="required-asterisk">*</span></label>}
                            <select
                              value={foiGroup.foiLoaNo}
                              onChange={(e) => onFoiLoaChange(pIdx, fIdx, e.target.value)}
                            >
                              <option value="" disabled>Select FOI / LOA number</option>
                              {foiLoas.map((foi) => (
                                <option key={foi} value={foi}>{foi}</option>
                              ))}
                            </select>
                          </div>

                          <div className="form-group">
                            {fIdx === 0 && <label>Contractor</label>}
                            <input
                              type="text"
                              value={foiGroup.contractor}
                              readOnly
                              placeholder="Auto-filled by system"
                              className="readonly-input"
                            />
                          </div>

                          <div className="form-group">
                            {fIdx === 0 && <label>Tender No</label>}
                            <input
                              type="text"
                              value={foiGroup.tenderNo}
                              readOnly
                              placeholder="Auto-filled by system"
                              className="readonly-input"
                            />
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                    {pIdx < formData.projectDetails.length - 1 && <hr className="project-block-divider" />}
                  </div>
                ))}

                <div className="project-actions-row">
                  <button type="button" className="btn-add-more" onClick={duplicateProjectDetail}>+ Add More</button>
                </div>
              </div>
            )}
          </section>

          {/* Use Case Configuration */}
          <section className="section-card">
            <div className="section-header" onClick={() => toggleSection('useCase')}>
              <div className="section-title-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="section-icon">
                  <path d="M3 12h4l2-6 4 12 2-6h6"></path>
                </svg>
                <h2>Use Case Configuration</h2>
              </div>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`chevron-arrow ${!sections.useCase ? 'rotate' : ''}`}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            {sections.useCase && (
              <div className="section-body">
                <div className="usecase-row">
                  <label className="usecase-label">Use Cases <span className="required-asterisk" style={{ color: '#ef4444' }}>*</span></label>
                  <select
                    className="usecase-dropdown"
                    name="useCase"
                    value={formData.useCase}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select use case</option>
                    {useCases.map((useCase) => (
                      <option key={useCase} value={useCase}>
                        {useCase}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Footer Actions */}
        <div className="footer-actions">
          <button type="button" className="btn btn-cancel" onClick={cancel}>Cancel</button>
          <button type="button" className="btn btn-draft" onClick={saveDraft}>Save Draft</button>
          <button type="button" className="btn btn-primary" onClick={addCamera}>Add Camera</button>
        </div>
      </form>
    </div>
  );
}
