import { beforeAll, afterAll, beforeEach, afterEach, vi } from "vitest";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import config from "../../src/config/config";
import { execaCommand } from "execa";
import { PrismaClient } from "@prisma/client";
import { iocContainer } from "../../src/ioc";
import { Rollback } from "../../src/types/exceptions";

let db_container: StartedPostgreSqlContainer;

beforeAll(async () => {
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

let tx_runner: Promise<void>;
let tx_closer: () => Promise<void>;

beforeEach(async () => {
  // Create lient to testcontainer
  const p_client: PrismaClient = new PrismaClient({
    datasourceUrl: config.db_url,
  });

  // Create promise to hold transaction until test is done
  const tx_waiter = new Promise<void>((resolve) => {
    // Globally set resolver
    tx_closer = async () => {
      resolve();
    };
  });

  // Create reference to resolve test_waiter
  let test_waiter_resolver: () => Promise<void>;
  // Create promise to hold test start until transaction is ready
  const test_waiter = new Promise<void>((resolve) => {
    // Set resolver
    test_waiter_resolver = async () => {
      resolve();
    };
  });

  // Start client transaction
  tx_runner = p_client.$transaction(async (tx) => {
    // Snapshot container to restore after test (since resolutions are mocked)
    iocContainer.snapshot();

    // Unbind DI DB_CLIENT
    await iocContainer.unbind("DB_CLIENT");
    // Bind DI DB_CLIENT to transaction
    /*
     * IMPORTANT: Due to DI might fail in parallel (since DB_CLIENT is rebound repeatedly)
     * This could be solved by using a different DI container for each test (would need access to test container before test starts)
     * Would also need to bind container at runtime (which is not how TSOA resolves container)
     *
     * After some research:
     * - Tests in same files run concurrently (parallelism isn't possible)
     * - Tests across files run in parallel (but also have own module graph => will have own instance of container)
     * - Thus, this is theoretically optimized
     */
    iocContainer
      .bind("DB_CLIENT")
      .toDynamicValue(() => tx)
      .inSingletonScope();

    // Resolve test_waiter (transaction ready)
    await test_waiter_resolver();

    // Wait for test to run
    await tx_waiter;

    // Restore container to original state
    /*
     * IMPORTANT: This fixes having to use transient scope
     * Prevents closed transaction issue from earlier
     * I guess we no longer need to spawn a new object for each resolution since it's a clean state
     */
    iocContainer.restore();

    // Force rollback
    throw new Rollback();
  });

  // Wait for transaction to be ready
  await test_waiter;
});

afterEach(async () => {
  // Close transaction
  await tx_closer();

  try {
    // Get return from transaction
    // Note this will already have resolved due to `await tx_waiter;` and `tx_close()`
    await tx_runner;
  } catch (e) {
    // Catch non-rollbacks
    if (!(e instanceof Rollback)) throw e;
  }
});

afterAll(async () => {
  // Drop container
  await db_container.stop();
});
