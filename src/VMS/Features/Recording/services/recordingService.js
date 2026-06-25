// ✅ Recording Service (Mock API - TL Ready)

const initialRecordings = [
  {
    id: '10001',
    name: 'FRONT ENTRANCE',
    location: 'Building A',
    specs: '4k . 30 fps',
    createdOn: new Date('2026-06-23T11:29:00'),
    videoStartTime: '11:29:00 AM',
    videoEndTime: '12:10:01 PM',
    duration: 755,
    totalDuration: 11570
  },
  {
    id: '10002',
    name: 'MAIN LOBBY',
    location: 'Building A',
    specs: '1080p . 30 fps',
    createdOn: new Date('2026-06-23T10:15:00'),
    videoStartTime: '10:15:00 AM',
    videoEndTime: '11:00:00 AM',
    duration: 2700,
    totalDuration: 2700
  },
  {
    id: '10003',
    name: 'GARAGE LEVEL',
    location: 'Building B',
    specs: '1080p . 30 fps',
    createdOn: new Date('2026-06-23T09:00:00'),
    videoStartTime: '09:00:00 AM',
    videoEndTime: '09:30:00 AM',
    duration: 1800,
    totalDuration: 1800
  },
  {
    id: '10004', 
    name: 'SIDE GATE',
    location: 'Building C',
    specs: '1080p . 30 fps',
    createdOn: new Date('2026-06-23T08:30:00'),
    videoStartTime: '08:30:00 AM',
    videoEndTime: '09:00:00 AM',
    duration: 1800,
    totalDuration: 1800
  },
  {
    id: 'LOADING',
    name: 'LOADING DOC',
    location: 'Building D',
    specs: 'Offline',
    createdOn: null,
    videoStartTime: '',
    videoEndTime: '',
    duration: 0,
    totalDuration: 0,
    isLoading: true
  },
  {
    id: '10005',
    name: 'PARKING LOT',
    location: 'Building B',
    specs: '1080p . 30 fps',
    createdOn: new Date('2026-06-23T07:00:00'),
    videoStartTime: '07:00:00 AM',
    videoEndTime: '07:45:00 AM',
    duration: 2700,
    totalDuration: 2700
  },
  {
    id: '10006',
    name: 'RECEPTION DESK',
    location: 'Building A',
    specs: '1080p . 30 fps',
    createdOn: new Date('2026-06-23T06:15:00'),
    videoStartTime: '06:15:00 AM',
    videoEndTime: '06:30:00 AM',
    duration: 900,
    totalDuration: 900
  },
  {
    id: '10007',
    name: 'EXECUTIVE FLOOR',
    location: 'Building A',
    specs: '4k . 30 fps',
    createdOn: new Date('2026-06-23T05:00:00'),
    videoStartTime: '05:00:00 AM',
    videoEndTime: '05:30:00 AM',
    duration: 1800,
    totalDuration: 1800
  },
  {
    id: '10008',
    name: 'FRONT ENTRANCE',
    location: 'Building B',
    specs: '4k . 30 fps',
    createdOn: new Date('2026-06-23T04:00:00'),
    videoStartTime: '04:00:00 AM',
    videoEndTime: '04:45:00 AM',
    duration: 2700,
    totalDuration: 2700
  }
];

let recordings = [...initialRecordings];

let listeners = [];

// ✅ API delay simulation
const delay = (data) =>
  new Promise((resolve) => setTimeout(() => resolve(data), 300));

// ✅ Notify subscribers
const notify = () => {
  listeners.forEach((cb) => cb([...recordings]));
};

// ✅ Generate next ID
const generateId = () => {
  const ids = recordings.map((r) => parseInt(r.id)).filter((n) => !isNaN(n));
  return String(ids.length ? Math.max(...ids) + 1 : 10001);
};

// ✅ Service
export const recordingService = {

  // ✅ GET /api/recordings
  async listRecordings() {
    return delay({
      success: true,
      data: recordings
    });
  },

  // ✅ Subscribe (auto UI update)
  subscribe(listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },

  // ✅ POST /api/recordings
  async createRecording(payload) {
    if (!payload || !payload.name) {
      throw new Error("400 Bad Request - name required");
    }

    const newRec = {
      id: generateId(),
      name: payload.name.toUpperCase(),
      location: payload.location || "Building A",
      specs: payload.specs || "1080p . 30 fps",
      createdOn: payload.createdOn || new Date(),
      videoStartTime: payload.videoStartTime || "",
      videoEndTime: payload.videoEndTime || "",
      duration: payload.duration || 0,
      totalDuration: payload.totalDuration || payload.duration || 0
    };

    recordings = [newRec, ...recordings];
    notify();

    return delay({
      success: true,
      data: newRec
    });
  },

  // ✅ GET /api/recordings/{id}
  async getRecordingById(id) {
    if (!id) throw new Error("400 Bad Request");

    const rec = recordings.find((r) => r.id === id);
    if (!rec) throw new Error("404 Not Found");

    return delay({
      success: true,
      data: rec
    });
  },

  // ✅ PUT /api/recordings/{id}
  async updateRecording(id, payload) {
    if (!id || !payload) throw new Error("400 Bad Request");

    const index = recordings.findIndex((r) => r.id === id);
    if (index === -1) throw new Error("404 Not Found");

    recordings[index] = {
      ...recordings[index],
      ...payload
    };

    notify();

    return delay({
      success: true,
      data: recordings[index]
    });
  },

  // ✅ DELETE /api/recordings/{id}
  async deleteRecording(id) {
    if (!id) throw new Error("400 Bad Request");

    recordings = recordings.filter((r) => r.id !== id);
    notify();

    return delay({
      success: true,
      message: "Recording deleted successfully"
    });
  },

  // ✅ GET metadata
  async getRecordingMetadata(id) {
    if (!id) throw new Error("400 Bad Request");

    const rec = recordings.find((r) => r.id === id);
    if (!rec) throw new Error("404 Not Found");

    return delay({
      success: true,
      data: {
        id: rec.id,
        name: rec.name,
        duration: rec.duration,
        totalDuration: rec.totalDuration,
        start: rec.videoStartTime,
        end: rec.videoEndTime,
        createdOn: rec.createdOn
      }
    });
  },

  // ✅ POST playback URL
  async generatePlaybackUrl(id) {
    if (!id) throw new Error("400 Bad Request");

    return delay({
      success: true,
      data: {
        playbackUrl: `/mock-playback/${id}.mp4`
      }
    });
  },

  // ✅ GET timeline
  async getRecordingTimeline(siteId) {
    if (!siteId) throw new Error("400 Bad Request");

    return delay({
      success: true,
      data: recordings.map((r) => ({
        id: r.id,
        name: r.name,
        start: r.videoStartTime,
        end: r.videoEndTime,
        duration: r.duration
      }))
    });
  }
};
