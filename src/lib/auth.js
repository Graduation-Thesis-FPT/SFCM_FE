const storeAccessToken = accessToken => {
  localStorage.setItem("accessToken", JSON.stringify(accessToken));
};

const getAccessToken = () => {
  let temp = localStorage.getItem("accessToken");
  if (!temp || temp === "undefined") return null;
  return JSON.parse(temp);
};

const storeRefreshToken = refreshToken => {
  localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
};

const getRefreshToken = () => {
  let temp = localStorage.getItem("refreshToken");
  if (!temp || temp === "undefined") return null;
  return JSON.parse(temp);
};

export { storeAccessToken, getAccessToken, storeRefreshToken, getRefreshToken };
