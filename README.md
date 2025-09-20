# Backend
* `pnpm --filter backend build` - build routes and OpenAPI spec + transpile into js
* `pnpm --filter backend build:sdk` - build api sdk from backend
* `docker build -t backend dist` - build container from backend

# Frontend
* `pnpm --filter frontend build` - build static site
* `pnpm --filter frontend dev` - start dev server
* `pnpm --filter frontend preview` - preview prod build

Testing branch protection