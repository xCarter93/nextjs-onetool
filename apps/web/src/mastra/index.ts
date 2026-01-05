import { Mastra } from "@mastra/core/mastra";
import { csvImportAgent } from "./agents/csv-import-agent";
import { reportAgent } from "./agents/report-agent";

export const mastra = new Mastra({
	agents: {
		csvImportAgent,
		reportAgent,
	},
});
