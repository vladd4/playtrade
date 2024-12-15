export const setToSessionStorage = (key: string, value: string) => {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(key, value);
  }
};

export const getFromSessionStorage = (key: string) => {
  if (typeof window !== "undefined") {
    return window.sessionStorage.getItem(key);
  } else return null;
};

export const removeFromSessionStorage = (key: string) => {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(key);
  }
};
