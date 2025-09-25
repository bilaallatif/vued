import { PrismaClient } from "@prisma/client";
import { Container } from "inversify";
import config from "./config/config";
import { UserService } from "./services/user-service";
import { UserController } from "./controllers/user-controller";
import { AuthController } from "./controllers/auth-controller";
import { MovieController } from "./controllers/movie-controller";
import { AuthService } from "./services/auth-service";
import { TmdbService } from "./services/tmdb-service";

const iocContainer: Container = new Container();

// ~~Controllers~~

iocContainer.bind(AuthController).toSelf().inSingletonScope();
iocContainer.bind(MovieController).toSelf().inSingletonScope();
iocContainer.bind(UserController).toSelf().inSingletonScope();

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
  .inSingletonScope();

// Inject UserService
iocContainer.bind(AuthService).toSelf().inSingletonScope();
iocContainer.bind(TmdbService).toSelf().inSingletonScope();
iocContainer.bind(UserService).toSelf().inSingletonScope();

export { iocContainer };
