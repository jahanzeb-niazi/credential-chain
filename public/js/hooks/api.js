import { config } from "../config/config.js";

async function request(path, options = {}) {
  const res = await fetch(`${config.backendBaseUrl}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) throw new Error(data.error || `Backend request failed (${res.status})`);
  return data;
}

export const api = {
  health:                  ()       => request("/api/health"),
  getConfig:               ()       => request("/api/config"),
  getRole:                 (wallet) => request(`/api/role?wallet=${encodeURIComponent(wallet)}`),
  getStats:                ()       => request("/api/stats"),
  uploadMetadata:          (meta)   => request("/api/ipfs/upload", { method: "POST", body: JSON.stringify(meta) }),
  fetchIpfs:               (cid)    => request(`/api/ipfs?cid=${encodeURIComponent(cid)}`),
  getCredential:           (id)     => request(`/api/credential?id=${encodeURIComponent(id)}`),
  getStudentCredentials:   (wallet) => request(`/api/credential/student?wallet=${encodeURIComponent(wallet)}`),
  getInstitutionCredentials:(wallet)=> request(`/api/credential/institution?wallet=${encodeURIComponent(wallet)}`),
  verify:                  (id)     => request(`/api/verify?id=${encodeURIComponent(id)}`),
  audit:                   (id)     => request(`/api/audit?id=${encodeURIComponent(id)}`),
  institutionActivity:     (wallet) => request(`/api/institution/activity?wallet=${encodeURIComponent(wallet)}`),
  studentActivity:         (wallet) => request(`/api/student/activity?wallet=${encodeURIComponent(wallet)}`),
  listRegulators:          ()       => request("/api/regulators"),
  listInstitutions:        ()       => request("/api/institutions"),
  getRegulator:            (wallet) => request(`/api/regulator?wallet=${encodeURIComponent(wallet)}`),
  getInstitution:          (wallet) => request(`/api/institution?wallet=${encodeURIComponent(wallet)}`),
};
