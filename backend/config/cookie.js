const cookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production" ? true : false,
  maxAge: 1000 * 60 * 60, // 1 hours
};

module.exports = cookieOptions;
