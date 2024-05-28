import { setUser } from "@/redux/slice/userSlice";
import { useDispatch } from "react-redux";

const key = {
  aToken: "accessToken",
  rToken: "refreshToken"
};

const storeAccessToken = accessToken => {
  localStorage.setItem(key.aToken, JSON.stringify(accessToken));
};

const getAccessToken = () => {
  let temp = localStorage.getItem(key.aToken);
  if (!temp || temp === "undefined") return null;
  return JSON.parse(temp);
};

const storeRefreshToken = refreshToken => {
  localStorage.setItem(key.rToken, JSON.stringify(refreshToken));
};

const getRefreshToken = () => {
  let temp = localStorage.getItem(key.rToken);
  if (!temp || temp === "undefined") return null;
  return JSON.parse(temp);
};

const removeRefreshAndAccessToken = () => {
  localStorage.removeItem(key.aToken);
  localStorage.removeItem(key.rToken);
};

const useCustomStore = () => {
  const dispatch = useDispatch();

  const store = userInfo => {
    storeRefreshToken(userInfo.refreshToken);
    storeAccessToken(userInfo.accessToken);
    dispatch(setUser(userInfo));
  };

  const remove = () => {
    removeRefreshAndAccessToken();
    dispatch(setUser({}));
  };
  return {
    store,
    remove
  };
};

export {
  storeAccessToken,
  getAccessToken,
  storeRefreshToken,
  getRefreshToken,
  removeRefreshAndAccessToken,
  useCustomStore
};
