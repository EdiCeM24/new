const useragent = require("useragent");
const { v4: uuidv4 } = require("uuid");
const { NODE_ENV } = require("../config/env");

const detectDevice = (req, res, next) => {
  try {
    const agent = useragent.parse(req.headers["user-agent"]);
    const deviceId = req.cookies.deviceId || uuidv4();

    req.device = {
      deviceId: deviceId,

      browser: agent.toAgent(),

      os: agent.os.toString(),

      ipAddress: req.ip,
    };

    if (!req.cookies.deviceId) {
      res.cookie("deviceId", deviceId, {
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 YEAR.
        http: true,
        sameSite: true,
        secure: NODE_ENV === "production",
      });
    }
  } catch (error) {
    console.log("Error detecting device: ", error);
    req.flash("error_msg", "Error in detecting device.", error);

    next(error);
  }

  next();
};

module.exports = { detectDevice };
