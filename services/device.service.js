const asyncHandler = require("../utils/asyncHandler");
const LoginDevice = require("../models/loginDevice");
const { default: hashToken } = require("../utils/hashToken");
const logger = require("../utils/let ");
//

const registerDevice = asyncHandler(async (user, device, refreshToken) => {
  try {
    // Validate input data
    if (!user || !device || !refreshToken) {
      throw new Error("error_msg", "Invalid input data");
    }

    // Hash the refreshToken
    const hashedRefreshToken = hashToken(refreshToken);

    // Create a new device registration
    const deviceRegistration = await LoginDevice.create({
      userId: user.id,
      deviceId: device.deviceId,
      browser: device.browser,
      os: device.os,
      ipAdress: device.ipAddress,
      refreshToken: hashedRefreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    // log the device registration
    logger.info(`Device registered: ${device.deviceId} for user ${user.id}`);

    return deviceRegistration;
  } catch (error) {
    // Log the error
    logger.error(`Error registering device: ${error.message}`);
    throw error;
  }
});

module.exports = registerDevice;
