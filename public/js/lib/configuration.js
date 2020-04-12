// Reusable function for GET requests
function get(path, init = {}) {
  return makeRequest(path, init);
}

// Reusable function for POST requests
function post(path, init = { method: "POST" }) {
  return makeRequest(path, init);
}

async function makeRequest(path, init) {
  const response = await fetch(path, init);

  if (response.ok) {
    return response.json();
  } else {
    let errorMessage;

    try {
      const responseBody = await response.json();
      errorMessage = responseBody.data.message;
    } catch (error) {
      errorMessage = response.statusText;
    }

    throw new Error(errorMessage);
  }
}

/*
EXPORTED API REQUEST METHODS
*/

export function getDashboard() {
  return get("/api/dashboard");
}

export function getDeviceList() {
  return get("/api/devices/list");
}

export function saveDashboard(dashboard) {
  // This init object can be accepted as optional parameters
  // see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Supplying_request_options
  const init = {
    method: "POST",
    body: JSON.stringify(dashboard),
    headers: {
      "Content-Type": "application/json"
    }
  };

  return post("/api/dashboard", init);
}
