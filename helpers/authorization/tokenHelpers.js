export const isTokenIncluded = (req) => {
  return (
    req.headers.authorization && req.headers.authorization.startsWith("Bearer:")
  );
};
export const getTokenFromHeader = (req) => {
  const token = req.headers.authorization.split(" ")[1];
  return token;
};
