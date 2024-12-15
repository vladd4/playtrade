export const buildQueryString = (params: { [key: string]: any }) => {
  const query = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      if (Array.isArray(params[key])) {
        params[key].forEach((value) => query.append(key, value));
      } else {
        query.append(key, params[key]);
      }
    }
  });
  return query.toString();
};
