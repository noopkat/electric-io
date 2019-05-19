export function getDashboard(vm, url) {
  return new Promise((resolve, reject) =>
    fetch((url = "/api/dashboard")).then(response => {
      // Promise is resolved if we get a 200 response status code
      response.ok
        ? resolve(response.json())
        : // If the response status ist't a 200, check if it's a 400
        response.status === 404
        ? // error response if the response status code is a 404
          reject(`Request to ${url} failed with 404 Page Not Found`)
        : // Catch all error response for any other response status code
          reject(`HTTP error at ${url}: ${response.status}`);
    })
  );
}

export function getDeviceList(url, devices) {
  return new Promise((resolve, reject) =>
    fetch((url = "/api/devices/list")).then(response => {
      // Promise is resolved if we get a 200 response status code
      response.ok
        ? resolve(response.json())
        : // If the response status ist't a 200, check if it's a 400
        response.status === 404
        ? // Error response if the response status code is a 404
          reject(`Request to ${url} failed with 404 Page Not Found`)
        : // Catch all error response for any other response status code
          reject(`HTTP error at ${url}: ${response.status}`);
    })
  );
}

export function saveDashboard(dashboard) {
  const body = JSON.stringify(dashboard);
  const headers = {
    "Content-Type": "application/json"
  };
  return fetch("/api/dashboard", { method: "POST", body, headers });
}
