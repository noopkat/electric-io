export function getDashboard(vm) {
  return fetch('/api/dashboard')
    .then((r) => r.json())
}

export function getDeviceList() {
  return fetch('/api/devices/list')
   .then((r) => r.json())
}

export function saveDashboard(dashboard) {
  const body = JSON.stringify(dashboard);
  const headers = {
    'Content-Type': 'application/json'
  };
  return fetch('/api/dashboard', {method: 'POST', body, headers})
}
