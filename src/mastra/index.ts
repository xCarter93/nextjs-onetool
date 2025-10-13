import { Mastra } from "@mastra/core/mastra";
import { csvImportAgent } from "./agents/csv-import-agent";

export const mastra = new Mastra({
	agents: {
		csvImportAgent,
	},
});
