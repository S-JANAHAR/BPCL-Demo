// Camera Service managing in-memory camera list, CRUD operations, and toasts

const initialCameras = [
  {
    id: '1A0B1CDTYO',
    name: 'Main Gate Camera',
    location: 'Unit 1, Building A, Ground Floor',
    status: 'Online',
    type: 'Fixed',
    serialNumber: 'SN1234567890',
    description: 'Main entrance gate facing the security checkpoint.',
    unitName: 'Unit 1',
    locationDetail: 'Building A',
    ipAddress: '192.168.1.101',
    port: '80',
    nameOfWork: 'Plant Surveillance System',
    foiLoaNo: 'LOA/2024/00123',
    contractor: 'ABC Constructions Pvt. Ltd.',
    tenderNo: 'TND/2024/0456',
    useCase: 'Barricading / Safety Railing',
     image: '/assets/cctv.png'
  },
  {
    id: '1A0B2CDTYO',
    name: 'Production Line 1',
    location: 'Unit 1, Building A, 1st Floor',
    status: 'Online',
    type: 'PTZ',
    serialNumber: 'SN1234567891',
    description: 'Primary camera for assembly line supervision.',
    unitName: 'Unit 1',
    locationDetail: 'Building A',
    ipAddress: '192.168.1.102',
    port: '80',
    nameOfWork: 'Work 2',
    foiLoaNo: 'FOI-22222',
    contractor: 'Contractor 2',
    tenderNo: 'TND-88888',
    useCase: 'Unsafe working at height',
    image: '/assets/cctv.png'
  },
  {
    id: '1A0B3CDTYO',
    name: 'Warehouse Entrance',
    location: 'Unit 2, Building B, Ground Floor',
    status: 'Offline',
    type: 'Fixed',
    serialNumber: 'SN1234567892',
    description: 'Monitors back loading dock and storage facility gates.',
    unitName: 'Unit 2',
    locationDetail: 'Building B',
    ipAddress: '192.168.1.103',
    port: '80',
    nameOfWork: 'Work 3',
    foiLoaNo: 'FOI-33333',
    contractor: 'Contractor 3',
    tenderNo: 'TND-77777',
    useCase: 'Intrusion in restricted zones detection',
    image: '/assets/cctv.png'
  },
  {
    id: '1A0B4CDTYO',
    name: 'Parking Area Camera',
    location: 'Unit 2, Building B, Ground Floor',
    status: 'Online',
    type: 'Fixed',
    serialNumber: 'SN1234567893',
    description: 'Vehicular parking lot overview.',
    unitName: 'Unit 2',
    locationDetail: 'Building B',
    ipAddress: '192.168.1.104',
    port: '8080',
    nameOfWork: 'Work 1',
    foiLoaNo: 'FOI-44444',
    contractor: 'Contractor 1',
    tenderNo: 'TND-66666',
    useCase: 'PPE (Helmet, Safety Jacket, Safety Shoe) non-compliance detection',
    image: '/assets/cctv.png'
  },
  {
    id: '1A0B5CDTYO',
    name: 'Dispatch Area',
    location: 'Unit 3, Building C, Ground Floor',
    status: 'Online',
    type: 'PTZ',
    serialNumber: 'SN1234567894',
    description: 'Monitors materials packing and outgoing truck bays.',
    unitName: 'Unit 3',
    locationDetail: 'Building C',
    ipAddress: '192.168.1.105',
    port: '80',
    nameOfWork: 'Work 2',
    foiLoaNo: 'FOI-55555',
    contractor: 'Contractor 2',
    tenderNo: 'TND-55555',
    useCase: 'Monitoring of safety during lifting detection',
    image: '/assets/cctv.png'
  },
  {
    id: '1A0B6CDTYO',
    name: 'Security Office',
    location: 'Unit 1, Building A, Ground Floor',
    status: 'Offline',
    type: 'Fixed',
    serialNumber: 'SN1234567895',
    description: 'Security room corridor camera.',
    unitName: 'Unit 1',
    locationDetail: 'Building A',
    ipAddress: '192.168.1.106',
    port: '80',
    nameOfWork: 'Work 3',
    foiLoaNo: 'FOI-66666',
    contractor: 'Contractor 3',
    tenderNo: 'TND-44444',
    useCase: 'Camera tampering detection',
    image: '/assets/cctv.png'
  },
  {
    id: '1A0B7CDTYO',
    name: 'Perimeter Camera 1',
    location: 'Unit 3, Building C, Ground Floor',
    status: 'Offline',
    type: 'PTZ',
    serialNumber: 'SN1234567896',
    description: 'South perimeter wall monitor.',
    unitName: 'Unit 3',
    locationDetail: 'Building C',
    ipAddress: '192.168.1.107',
    port: '8081',
    nameOfWork: 'Work 1',
    foiLoaNo: 'FOI-77777',
    contractor: 'Contractor 1',
    tenderNo: 'TND-33333',
    useCase: 'Intrusion in restricted zones detection',
    image: '/assets/cctv.png'
  },
  {
    id: '1A0B8CDTYO',
    name: 'Perimeter Camera 2',
    location: 'Unit 3, Building C, Ground Floor',
    status: 'Online',
    type: 'Fixed',
    serialNumber: 'SN1234567897',
    description: 'East perimeter gate monitor.',
    unitName: 'Unit 3',
    locationDetail: 'Building C',
    ipAddress: '192.168.1.108',
    port: '80',
    nameOfWork: 'Work 2',
    foiLoaNo: 'FOI-88888',
    contractor: 'Contractor 2',
    tenderNo: 'TND-22222',
    useCase: 'Absence of barricades/ safety railing',
    image: '/assets/cctv.png'
  },
  {
    id: '1A0B9CDTYO',
    name: 'Perimeter Camera 3',
    location: 'Unit 3, Building C, Ground Floor',
    status: 'Online',
    type: 'PTZ',
    serialNumber: 'SN1234567898',
    description: 'North boundary wall monitor.',
    unitName: 'Unit 3',
    locationDetail: 'Building C',
    ipAddress: '192.168.1.109',
    port: '80',
    nameOfWork: 'Work 3',
    foiLoaNo: 'FOI-99999',
    contractor: 'Contractor 3',
    tenderNo: 'TND-11111',
    useCase: 'Fire, smoke detection',
    image: '/assets/cctv.png'
  }
];

const generateCameras = () => {
  const list = [...initialCameras];
  let onlineNeeded = 92;
  let offlineNeeded = 27;

  const locations = [
    'Unit 1, Building A, Ground Floor',
    'Unit 1, Building A, 1st Floor',
    'Unit 2, Building B, Ground Floor',
    'Unit 3, Building C, Ground Floor',
    'Unit 3, Building C, 1st Floor'
  ];

  const types = ['Fixed', 'PTZ'];
  const workNames = ['Plant Surveillance System', 'Work 1', 'Work 2', 'Work 3'];
  const contractors = ['Contractor 1', 'Contractor 2', 'Contractor 3'];
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

  for (let i = 10; i <= 128; i++) {
    const id = `1A0B${i}CDTYO`;

    let status;
    if (onlineNeeded > 0 && offlineNeeded > 0) {
      status = Math.random() > 0.3 ? 'Online' : 'Offline';
    } else if (onlineNeeded > 0) {
      status = 'Online';
    } else {
      status = 'Offline';
    }

    if (status === 'Online') onlineNeeded--;
    else offlineNeeded--;

    const type = types[Math.floor(Math.random() * types.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const name = type === 'PTZ' ? `Dome PTZ Camera ${i - 9}` : `Fixed Bullet Camera ${i - 9}`;

    const parts = location.split(', ');
    const unitName = parts[0] || 'Unit 1';
    const locationDetail = parts[1] || 'Building A';
    
const images = [
  '/assets/cctv.png'
];


    list.push({
      id,
      name,
      location,
      status,
      type,
      serialNumber: `SN${234567800 + i}`,
      description: `Description for ${name} at ${location}`,
      unitName,
      locationDetail,
      ipAddress: `192.168.1.${100 + i}`,
      port: '80',
      nameOfWork: workNames[Math.floor(Math.random() * workNames.length)],
      foiLoaNo: `FOI-${30000 + i}`,
      contractor: contractors[Math.floor(Math.random() * contractors.length)],
      tenderNo: `TND-${80000 + i}`,
      useCase: useCases[Math.floor(Math.random() * useCases.length)],
      image: images[0]
    });
  }

  return list;
};

const defaultConfiguration = {
  recording: {
    retentionSchedule: '30 days',
    archive: 'Enabled',
    exportOption: 'Enabled'
  },
  aiRules: [
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
  ],
  alerts: {
    severity: 'High',
    escalation: 'Level 2',
    site: 'Plant A',
    notification: 'Email',
    websocket: 'Enabled'
  },
  streaming: [
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
  ]
};

let cameras = generateCameras().map(c => ({
  ...c,
  configuration: JSON.parse(JSON.stringify(defaultConfiguration))
}));
let listeners = [];
let toastListeners = [];
let editingCamera = null;
let deletingCamera = null;
let toastMessage = null;
let toastType = 'success';

const notify = () => {
  listeners.forEach(l => l([...cameras]));
};

const notifyToast = () => {
  toastListeners.forEach(l => l({ message: toastMessage, type: toastType }));
};

export const cameraService = {
  getCameras: () => cameras,
  subscribe: (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  subscribeToast: (listener) => {
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  },

  getEditingCamera: () => editingCamera,
  setEditingCamera: (cam) => {
    editingCamera = cam;
  },

  getDeletingCamera: () => deletingCamera,
  setDeletingCamera: (cam) => {
    deletingCamera = cam;
  },

  showToast: (msg, type = 'success') => {
    toastMessage = msg;
    toastType = type;
    notifyToast();
    setTimeout(() => {
      if (toastMessage === msg) {
        toastMessage = null;
        notifyToast();
      }
    }, 3000);
  },

  addCamera: (cam) => {
    cameras = [cam, ...cameras];
    cameraService.showToast(`Camera "${cam.name}" added successfully (Mock Mode)`, 'success');
    notify();
  },

  updateCamera: (updated) => {
    cameras = cameras.map(c => c.id === updated.id ? updated : c);
    if (editingCamera && editingCamera.id === updated.id) {
      editingCamera = updated;
    }
    cameraService.showToast(`Camera "${updated.name}" updated successfully (Mock Mode)`, 'success');
    notify();
  },

  deleteCamera: (id) => {
    const cam = cameras.find(c => c.id === id);
    cameras = cameras.filter(c => c.id !== id);
    if (cam) {
      cameraService.showToast(`Camera "${cam.name}" deleted successfully (Mock Mode)`, 'success');
    }
    notify();
  },

  deleteCameras: (ids) => {
    const deletedCount = ids.length;
    cameras = cameras.filter(c => !ids.includes(c.id));
    cameraService.showToast(`${deletedCount} camera(s) deleted successfully (Mock Mode)`, 'success');
    notify();
  }
};
