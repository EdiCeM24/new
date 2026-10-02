const cleanupExpiredUsers = require("../jobs/cleanupExpiredUsers");
const cron = require("node-cron");

// Schedule the task to run every day at midnight ('0 0 ***')

cron.schedule("0 0 ***", () => {
  console.log("Running daily cron job: cleanupExpiredUsers");
  cleanupExpiredUsers();
});
