import { subDomainList } from "/src/utils/Constant";

export const getApps = () => {
  const subdomain = getSubDomain(window.location.hostname);

  const mainApp = subDomainList.find((app) => app.main);
  if (subdomain === "") return mainApp.app;

  const apps = subDomainList.find((app) => subdomain === app.subdomain);

  return apps ? apps.app : mainApp.app;
};

export const getSubDomain = (location) => {
  const locationParts = location.split(".");
  const isLocalhost = locationParts.slice(-1)[0] === "localhost";
  const sliceTill = isLocalhost ? -1 : -2;
  return locationParts.slice(0, sliceTill).join("");
};

// JWT Helper function to decode token
export const decodeJWT = (token) => {
  try {
    if (!token) return null;

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

// Extract username from JWT token
export const getUserFromToken = (token) => {
  const decoded = decodeJWT(token);
  return decoded
    ? {
        username: decoded.sub || decoded.username,
        email: decoded.email,
        // Add other fields as needed
      }
    : null;
};
