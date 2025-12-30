
// import axios from "axios";

// const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

// export const setupAxiosInterceptors = () => {
//   axios.interceptors.request.use(
//     (config) => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   axios.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       if (error.response?.status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("username");
//         if (!window.location.pathname.includes('/login')) {
//           window.location.href = "/login";
//         }
//       }
//       return Promise.reject(error);
//     }
//   );
// };

// // AUTH
// export async function login(username, password) {
//   const form = new FormData();
//   form.append("username", username);
//   form.append("password", password);

//   const res = await axios.post(`${API_BASE}/auth/login/`, form, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
  
//   if (res.data.access_token) {
//     localStorage.setItem("token", res.data.access_token);
//     localStorage.setItem("username", username);
//   }
  
//   return res.data;
// }

// export async function registerUser(payload) {
//   const res = await axios.post(`${API_BASE}/auth/register/`, payload);
//   return res.data;
// }

// export async function getMe() {
//   const res = await axios.get(`${API_BASE}/auth/me/`);
//   return res.data;
// }

// export async function logout() {
//   try {
//     await axios.post(`${API_BASE}/auth/logout/`);
//   } finally {
//     localStorage.removeItem("token");
//     localStorage.removeItem("username");
//   }
// }

// // SALES LEADS - Updated for pagination
// export async function getSalesLeads(params = {}) {
//   const { skip = 0, limit = 50, status, location, search } = params;
  
//   const res = await axios.get(`${API_BASE}/leads/`, {
//     params: { skip, limit, status, location, search }
//   });
  
//   // Backend returns: { items: [...], total: 100, skip: 0, limit: 50, has_more: true }
//   return res.data;
// }

// export async function getLeadsStats() {
//   const res = await axios.get(`${API_BASE}/leads/stats/`);
//   return res.data;
// }

// export async function getLeadById(id) {
//   const res = await axios.get(`${API_BASE}/leads/${id}/`);
//   return res.data;
// }

// export async function createLead(payload) {
//   const res = await axios.post(`${API_BASE}/leads/`, payload);
//   return res.data;
// }

// export async function updateLead(id, payload) {
//   const res = await axios.patch(`${API_BASE}/leads/${id}/`, payload);
//   return res.data;
// }

// export async function updateLeadStatus(id, status) {
//   const res = await axios.patch(`${API_BASE}/leads/${id}/status/`, { status });
//   return res.data;
// }

// export async function deleteLead(id) {
//   const res = await axios.delete(`${API_BASE}/leads/${id}/`);
//   return res.data;
// }

// // PACKAGING
// export async function getPackaging() {
//   const res = await axios.get(`${API_BASE}/packaging/`);
//   return res.data;
// }

// export async function createPackaging(payload) {
//   const res = await axios.post(`${API_BASE}/packaging/`, payload);
//   return res.data;
// }

// // COSTINGS - Updated for pagination
// export async function getCostings(params = {}) {
//   const { skip = 0, limit = 50, project_code, status, search } = params;
  
//   const res = await axios.get(`${API_BASE}/costings/`, {
//     params: { skip, limit, project_code, status, search }
//   });
  
//   // Backend returns: { items: [...], total: 100, skip: 0, limit: 50, has_more: true }
//   return res.data;
// }

// export async function getCostingById(id) {
//   const res = await axios.get(`${API_BASE}/costing/${id}/`);
//   return res.data;
// }

// export async function createCosting(form) {
//   const fd = new FormData();

//   Object.keys(form).forEach((key) => {
//     const value = form[key];
//     if (value !== null && value !== undefined && value !== '') {
//       fd.append(key, value);
//     }
//   });

//   const res = await axios.post(`${API_BASE}/costing/new/form/`, fd, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

//   return res.data;
// }

// export async function updateCosting(id, payload) {
//   const res = await axios.put(`${API_BASE}/costing/${id}/edit/`, payload);
//   return res.data;
// }

// export async function duplicateCosting(id) {
//   const res = await axios.post(`${API_BASE}/costing/${id}/duplicate/`);
//   return res.data;
// }

// export async function deleteCosting(id) {
//   const res = await axios.delete(`${API_BASE}/costing/${id}/`);
//   return res.data;
// }

// // QUOTATIONS - Updated for pagination
// export async function getQuotations(params = {}) {
//   const { skip = 0, limit = 50, project_code } = params;
  
//   const res = await axios.get(`${API_BASE}/quotations/`, {
//     params: { skip, limit, project_code }
//   });
  
//   return res.data;
// }

// export async function getQuotationByProjectCode(projectCode) {
//   const res = await axios.get(`${API_BASE}/quotation/${projectCode}/`);
//   return res.data;
// }

// export async function createQuotation(payload) {
//   const res = await axios.post(`${API_BASE}/quotations/`, payload);
//   return res.data;
// }

// export async function updateQuotation(id, payload) {
//   const res = await axios.put(`${API_BASE}/quotations/${id}/`, payload);
//   return res.data;
// }

// export async function deleteQuotation(id) {
//   const res = await axios.delete(`${API_BASE}/quotations/${id}/`);
//   return res.data;
// }

// export async function exportQuotationExcel(projectCode) {
//   const res = await axios.get(`${API_BASE}/quotation/${projectCode}/export/`, {
//     responseType: 'blob',
//   });
//   return res.data;
// }

// // PROJECT DATA - Fetch all costings + quotations for a project code
// export async function getProjectData(projectCode) {
//   const res = await axios.get(`${API_BASE}/project/${projectCode}/`);
//   return res.data;
// }

// // UTILITY
// export function isAuthenticated() {
//   return !!localStorage.getItem("token");
// }

// export function getStoredUsername() {
//   return localStorage.getItem("username");
// }


import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

// Log the API base URL for debugging
console.log("🌐 API Base URL:", API_BASE);

export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log("📤 Request:", config.method.toUpperCase(), config.url);
      return config;
    },
    (error) => {
      console.error("❌ Request error:", error);
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      console.log("✅ Response:", response.status, response.config.url);
      return response;
    },
    (error) => {
      console.error("❌ Response error:", error.response?.status, error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        if (!window.location.pathname.includes('/login')) {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );
};

// ─────────────────────────────────────────────
// AUTH - FIXED LOGIN
// ─────────────────────────────────────────────
export async function login(username, password) {
  try {
    // ✅ Use URLSearchParams for application/x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    console.log("🔐 Attempting login for:", username);

    const res = await axios.post(`${API_BASE}/auth/login/`, params, {
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded"
      },
    });
    
    console.log("✅ Login successful:", res.data);
    
    if (res.data.access_token) {
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("username", username);
    }
    
    return res.data;
  } catch (error) {
    console.error("❌ Login failed:", error.response?.data || error.message);
    throw error;
  }
}

export async function registerUser(payload) {
  const res = await axios.post(`${API_BASE}/auth/register/`, payload);
  return res.data;
}

export async function getMe() {
  const res = await axios.get(`${API_BASE}/auth/me/`);
  return res.data;
}

export async function logout() {
  try {
    await axios.post(`${API_BASE}/auth/logout/`);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  }
}

// ─────────────────────────────────────────────
// SALES LEADS - Updated for pagination
// ─────────────────────────────────────────────
export async function getSalesLeads(params = {}) {
  const { skip = 0, limit = 50, status, location, search } = params;
  
  const res = await axios.get(`${API_BASE}/leads/`, {
    params: { skip, limit, status, location, search }
  });
  
  return res.data;
}

export async function getLeadsStats() {
  const res = await axios.get(`${API_BASE}/leads/stats/`);
  return res.data;
}

export async function getLeadById(id) {
  const res = await axios.get(`${API_BASE}/leads/${id}/`);
  return res.data;
}

export async function createLead(payload) {
  const res = await axios.post(`${API_BASE}/leads/`, payload);
  return res.data;
}

export async function updateLead(id, payload) {
  const res = await axios.patch(`${API_BASE}/leads/${id}/`, payload);
  return res.data;
}

export async function updateLeadStatus(id, status) {
  const res = await axios.patch(`${API_BASE}/leads/${id}/status/`, { status });
  return res.data;
}

export async function deleteLead(id) {
  const res = await axios.delete(`${API_BASE}/leads/${id}/`);
  return res.data;
}

// ─────────────────────────────────────────────
// PACKAGING
// ─────────────────────────────────────────────
export async function getPackaging() {
  const res = await axios.get(`${API_BASE}/packaging/`);
  return res.data;
}

export async function createPackaging(payload) {
  const res = await axios.post(`${API_BASE}/packaging/`, payload);
  return res.data;
}

// ─────────────────────────────────────────────
// COSTINGS - Updated for pagination
// ─────────────────────────────────────────────
export async function getCostings(params = {}) {
  const { skip = 0, limit = 50, project_code, status, search } = params;
  
  const res = await axios.get(`${API_BASE}/costings/`, {
    params: { skip, limit, project_code, status, search }
  });
  
  return res.data;
}

export async function getCostingById(id) {
  const res = await axios.get(`${API_BASE}/costing/${id}/`);
  return res.data;
}

export async function createCosting(form) {
  const fd = new FormData();

  Object.keys(form).forEach((key) => {
    const value = form[key];
    if (value !== null && value !== undefined && value !== '') {
      fd.append(key, value);
    }
  });

  const res = await axios.post(`${API_BASE}/costing/new/form/`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

export async function updateCosting(id, payload) {
  const res = await axios.put(`${API_BASE}/costing/${id}/edit/`, payload);
  return res.data;
}

export async function duplicateCosting(id) {
  const res = await axios.post(`${API_BASE}/costing/${id}/duplicate/`);
  return res.data;
}

export async function deleteCosting(id) {
  const res = await axios.delete(`${API_BASE}/costing/${id}/`);
  return res.data;
}

// ─────────────────────────────────────────────
// QUOTATIONS - Updated for pagination
// ─────────────────────────────────────────────
export async function getQuotations(params = {}) {
  const { skip = 0, limit = 50, project_code } = params;
  
  const res = await axios.get(`${API_BASE}/quotations/`, {
    params: { skip, limit, project_code }
  });
  
  return res.data;
}

export async function getQuotationByProjectCode(projectCode) {
  const res = await axios.get(`${API_BASE}/quotation/${projectCode}/`);
  return res.data;
}

export async function createQuotation(payload) {
  const res = await axios.post(`${API_BASE}/quotations/`, payload);
  return res.data;
}

export async function updateQuotation(id, payload) {
  const res = await axios.put(`${API_BASE}/quotations/${id}/`, payload);
  return res.data;
}

export async function deleteQuotation(id) {
  const res = await axios.delete(`${API_BASE}/quotations/${id}/`);
  return res.data;
}

export async function exportQuotationExcel(projectCode) {
  const res = await axios.get(`${API_BASE}/quotation/${projectCode}/export/`, {
    responseType: 'blob',
  });
  return res.data;
}

// ─────────────────────────────────────────────
// PROJECT DATA
// ─────────────────────────────────────────────
export async function getProjectData(projectCode) {
  const res = await axios.get(`${API_BASE}/project/${projectCode}/`);
  return res.data;
}

// ─────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────
export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export function getStoredUsername() {
  return localStorage.getItem("username");
}
