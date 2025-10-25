import { defineApp } from "convex/server";
import aggregate from "@convex-dev/aggregate/convex.config";

const app = defineApp();

// Define separate aggregates for different home stats metrics
app.use(aggregate, { name: "clientCounts" });
app.use(aggregate, { name: "projectCounts" });
app.use(aggregate, { name: "quoteCounts" });
app.use(aggregate, { name: "invoiceRevenue" });
app.use(aggregate, { name: "invoiceCounts" });

export default app;
