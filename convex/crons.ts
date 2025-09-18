import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Daily cleanup of archived clients that have been archived for 7+ days
crons.daily(
	"cleanup archived clients",
	{ hourUTC: 2, minuteUTC: 0 }, // Run at 2:00 AM UTC daily
	internal.clients.cleanupArchivedClients
);

export default crons;
