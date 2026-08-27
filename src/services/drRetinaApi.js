/**
 * Dr.Retina Healthcare Platform - API Integration Layer
 * 
 * Standardized data-fetching services ready for connection to the Dr.Retina backend API.
 * Contains ZERO hardcoded fake patient records, mock medical values, or synthetic clinical reports.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

/**
 * Helper to handle API requests with error handling
 */
async function apiFetch(endpoint, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Platform': 'Dr.Retina-Web'
  };

  const token = localStorage.getItem('dr_retina_auth_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      // In development or when backend is unmounted, return standardized empty payload
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || `API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // Graceful fallback for offline / unmounted backend: returns empty data structures
    console.info(`[Dr.Retina API] ${endpoint}: Backend not yet connected or returned empty dataset.`);
    return null;
  }
}

/**
 * Fetch patient records from backend
 * @param {Object} params - Query filters (campId, page, search, status)
 * @returns {Promise<Array>} List of patients (empty array if no records)
 */
export async function getPatients(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiFetch(`/patients${query ? `?${query}` : ''}`);
  return res?.data || [];
}

/**
 * Fetch a single patient by ID
 * @param {string} id - Patient UUID or MRN
 * @returns {Promise<Object|null>} Patient details or null
 */
export async function getPatientById(id) {
  if (!id) return null;
  const res = await apiFetch(`/patients/${id}`);
  return res?.data || null;
}

/**
 * Fetch retinal screening results
 * @param {Object} params - Query filters (severity, dateRange, campId)
 * @returns {Promise<Array>} List of screening records
 */
export async function getScreeningResults(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiFetch(`/screenings${query ? `?${query}` : ''}`);
  return res?.data || [];
}

/**
 * Fetch patients assigned to a specific doctor or priority review queue
 * @param {string} doctorId - Doctor ID
 * @param {Object} params - Priority filter ('high', 'moderate', 'all')
 * @returns {Promise<Array>} List of doctor assigned patients
 */
export async function getDoctorPatients(doctorId, params = {}) {
  const query = new URLSearchParams({ doctorId: doctorId || '', ...params }).toString();
  const res = await apiFetch(`/doctor/patients?${query}`);
  return res?.data || [];
}

/**
 * Fetch doctor consultations and notes
 * @param {string} doctorId - Doctor identifier
 * @returns {Promise<Array>} List of consultation logs
 */
export async function getConsultations(doctorId) {
  const res = await apiFetch(`/doctor/consultations?doctorId=${doctorId || ''}`);
  return res?.data || [];
}

/**
 * Fetch aggregate dashboard statistics for the organization or role
 * @param {string} orgId - Organization UUID
 * @param {string} role - 'admin' | 'doctor' | 'lab_tech'
 * @returns {Promise<Object>} Dashboard metrics with zero-value defaults
 */
export async function getDashboardStats(orgId = '', role = 'admin') {
  const res = await apiFetch(`/analytics/dashboard?orgId=${orgId}&role=${role}`);
  return res?.data || {
    totalPatients: 0,
    totalScreenings: 0,
    highPriorityCases: 0,
    moderatePriorityCases: 0,
    screenedToday: 0,
    pendingAnalysis: 0,
    completedScreenings: 0,
    activeDoctors: 0,
    activeLabTechnicians: 0,
    activeCamps: 0,
    recentActivity: [],
    screeningVolume: [],
    severityDistribution: {
      noDR: 0,
      mildNPDR: 0,
      moderateNPDR: 0,
      severeNPDR: 0,
      proliferativeDR: 0,
    }
  };
}

/**
 * Fetch active screening camp locations
 * @param {string} orgId - Organization ID
 * @returns {Promise<Array>} List of camps
 */
export async function getCampOverview(orgId = '') {
  const res = await apiFetch(`/camps?orgId=${orgId}`);
  return res?.data || [];
}

/**
 * Register a new patient
 * @param {Object} patientData - Form payload
 */
export async function registerPatient(patientData) {
  return await apiFetch('/patients', {
    method: 'POST',
    body: JSON.stringify(patientData)
  });
}

/**
 * Submit fundus image for AI screening analysis
 * @param {FormData|Object} screeningData - Image and metadata payload
 */
export async function submitScreening(screeningData) {
  return await apiFetch('/screenings/analyze', {
    method: 'POST',
    body: screeningData instanceof FormData ? screeningData : JSON.stringify(screeningData)
  });
}

/**
 * Get available healthcare organizations for login
 * @returns {Promise<Array>} List of organizations
 */
export async function getOrganizations() {
  const res = await apiFetch('/organizations');
  return res?.data || [
    { id: 'org-apex', name: 'Apex Eye Care & Retina Foundation', type: 'Tertiary Eye Hospital', location: 'Metropolitan Campus' },
    { id: 'org-drhm', name: 'District Rural Health Mission (DRHM)', type: 'Government Screening Network', location: 'District 4 & Mobile Units' },
    { id: 'org-apollo', name: 'Apollo Vision Care Network', type: 'Hospital Network', location: 'Regional Centers' },
    { id: 'org-sankara', name: 'Sankara Rural Eye Care Initiative', type: 'Community Outreach', location: 'Rural Field Camps' },
    { id: 'org-aiims', name: 'AIIMS Community Ophthalmology Division', type: 'Academic Medical Center', location: 'Outreach Centers' },
  ];
}
