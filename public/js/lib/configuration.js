// Reusable function for GET requests
const getApiDataFrom = url =>
  new Promise((resolve, reject) =>
    fetch(url).then(response =>
      // Promise is resolved if we get a 200 response status code
      response.ok
        ? resolve(response.json())
        : // If the response status ist't a 200, check if it's a 404
        response.status === 404
        ? // Error response if the response status code is a 404
          reject(`Request to ${url} failed with 404 Page Not Found`)
        : // Catch all error response for any other response status code
          reject(`HTTP error at ${url}: ${response.status}`)
    )
  );

// Reusable function for POST requests
const postApiDataTo = (url, body, headers) =>
  fetch(url, {
    // This init object can be accepted as optional parameters
    // see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Supplying_request_options
    method: "POST",
    body: body,
    headers: headers
  }).then(response =>
    // Promise is resolved if we get a 200 response status code
    response.ok
      ? response
      : // If the response status ist't a 200, check if it's a 404
      response.status === 404
      ? // Error response if the response status code is a 404
        console.error(`Request to ${url} failed with 404 Page Not Found`)
      : // Catch all error response for any other response status code
        console.error(`HTTP error at ${url}: ${response.status}`)
  );

// Exported API request methods
export const getDashboard = () => getApiDataFrom("/api/dashboard");

export const getDeviceList = () => getApiDataFrom("/api/devices/list");

export function saveDashboard(dashboard) {
  const body = JSON.stringify(dashboard);
  const headers = {
    "Content-Type": "application/json"
  };

  return postApiDataTo("/api/dashboard", body, headers);
}
