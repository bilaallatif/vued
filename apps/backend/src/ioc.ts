import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import { Container } from "inversify";
import config from "./config/config";
import { UserService } from "./services/user-service";
import { UserController } from "./controllers/user-controller";
import { AuthController } from "./controllers/auth-controller";
import { MovieController } from "./controllers/movie-controller";
import { AuthService } from "./services/auth-service";
import { TmdbService } from "./services/tmdb-service";
import { TestController } from "./controllers/test-controller";

const iocContainer: Container = new Container();

// ~~Controllers~~
// Currently all transient due to tests (need to rebind PrismClient for every new testcontainer)

iocContainer.bind(TestController).toSelf().inTransientScope();
iocContainer.bind(AuthController).toSelf().inTransientScope();
iocContainer.bind(MovieController).toSelf().inTransientScope();
iocContainer.bind(UserController).toSelf().inTransientScope();

// ~~~Services~~~

// Inject prisma client
iocContainer
  .bind(PrismaClient)
  .toDynamicValue(
    () =>
      new PrismaClient({
        datasources: {
          db: { url: config.db_url },
        },
      }),
  )
  .inTransientScope();

// Inject UserService
export const ServiceIdentifiers = {
  IUserService: Symbol.for("IUserService"),
};

iocContainer.bind(AuthService).toSelf().inTransientScope();
iocContainer.bind(TmdbService).toSelf().inTransientScope();
iocContainer.bind(UserService).toSelf().inTransientScope();

export { iocContainer };
