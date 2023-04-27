module.exports = {
  verbose: true,
  roots: ["<rootDir>/src"],
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "./src/test_utils/setup.ts",
  setupFilesAfterEnv: ["./src/test_utils/db_setup.ts"],
};
