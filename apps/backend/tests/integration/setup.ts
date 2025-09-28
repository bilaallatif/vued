import { afterEach, beforeEach } from "vitest";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import config from "../../src/config/config";
import { execaCommand } from "execa";

let db_container: StartedPostgreSqlContainer;

// todo: should make this beforeAll s.t. we can instead use transactions
beforeEach(async () => {
  // Spin up container for database
  db_container = await new PostgreSqlContainer("postgres:13.3-alpine")
    .withEnvironment({
      POSTGRES_PASSWORD: "test",
      POSTGRES_USER: "test",
      POSTGRES_DB: "test",
    })
    .withExposedPorts(5432)
    .start();

  // Find mapped port for internal postgres port
  const mapped_port = db_container.getMappedPort(5432);
  // Construct database url
  const db_url = `postgresql://test:test@localhost:${mapped_port}/test`;

  // Execute schema migration
  await execaCommand("npx prisma migrate deploy", {
    env: { DATABASE_URL: db_url },
  });

  // Update db_url in config
  // This should apply to app consuming module level config
  config.db_url = `postgresql://test:test@localhost:${mapped_port}/test`;
}, 100000);

afterEach(async () => {
  // Drop container
  await db_container.stop();
});
