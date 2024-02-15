import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
	verbose: true,
	preset: "ts-jest",
	testPathIgnorePatterns: ["/node_modules/", "/dist/"]
};

export default config;
