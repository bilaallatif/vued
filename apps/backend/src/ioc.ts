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
import { ReviewService } from "./services/review-service";
import { ProfileService } from "./services/profile-service";
import { ReviewController } from "./controllers/review-controller";
import { MovieService } from "./services/movie-service";
import { TmdbController } from "./controllers/tmdb-controller";
import { ProfileController } from "./controllers/profile-controller";

const iocContainer: Container = new Container();

// ~~Controllers~~
// Currently all transient due to tests (need to rebind PrismClient for every new testcontainer)

iocContainer.bind(TestController).toSelf().inSingletonScope();
iocContainer.bind(AuthController).toSelf().inSingletonScope();
iocContainer.bind(MovieController).toSelf().inSingletonScope();
iocContainer.bind(TmdbController).toSelf().inSingletonScope();
iocContainer.bind(UserController).toSelf().inSingletonScope();
iocContainer.bind(ReviewController).toSelf().inSingletonScope();
iocContainer.bind(ProfileController).toSelf().inSingletonScope();

// ~~~Services~~~

// Inject prisma client
iocContainer
  .bind("DB_CLIENT")
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
iocContainer.bind(ReviewService).toSelf().inSingletonScope();
iocContainer.bind(ProfileService).toSelf().inSingletonScope();
iocContainer.bind(MovieService).toSelf().inSingletonScope();

export { iocContainer };
