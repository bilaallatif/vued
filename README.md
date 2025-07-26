# SPEC-1-Monorepo-AWS-CDK-SDK

## Background

A fullstack TypeScript-based monorepo is being developed to serve a React + Vite frontend and an Express backend. The backend will expose a REST API documented using OpenAPI, from which a TypeScript client SDK will be generated and consumed by the frontend. The entire system is to be deployed to AWS using Infrastructure as Code (IaC) via AWS CDK, with the frontend served via S3 + CloudFront and the backend hosted on EC2. The domain is managed in Vercel, so DNS records will be pointed manually to AWS endpoints. Although Vercel provides automatic TLS certificates, AWS services (CloudFront, ALB) require ACM certificates for HTTPS termination when directly routed.

To enhance security, the backend API will not be publicly accessible. Instead, CloudFront will reverse-proxy requests to the backend via a private ALB, with routing based on the `/api/*` path. This ensures API traffic is only accessible through the frontend domain.

## Requirements

### Must Have

- Monorepo structure supporting multiple apps and shared packages.
- Backend exposing an OpenAPI-compliant API.
- TypeScript SDK client auto-generated from OpenAPI spec.
- SDK to be consumed directly in the frontend workspace.
- Frontend app built with Vite, React, and TypeScript.
- Backend with Express and TypeScript.
- AWS CDK used to provision:
  - S3 bucket for frontend hosting
  - CloudFront for CDN and reverse proxy to backend
  - EC2 instance for backend
  - ALB (internal) for routing traffic from CloudFront to backend
  - ACM certificate for TLS
  - IAM roles, security groups, etc.

### Should Have

- CI/CD pipelines for building and deploying both apps.
- CORS and secure API access from frontend to backend.

### Could Have

- Monitoring via CloudWatch.

### Won't Have

- Serverless components (e.g., Lambda) for this iteration.

## Method

### Project Structure

```bash
my-monorepo/
├── apps/
│   ├── frontend/            # Vite + React + TS frontend
│   └── backend/             # Express + tsoa backend
├── packages/
│   └── sdk/                 # Auto-generated TS client SDK
├── infra/                   # AWS CDK stacks (TypeScript)
├── scripts/                 # Build/deploy helper scripts
├── .github/workflows/       # GitHub Actions CI/CD pipelines
├── pnpm-workspace.yaml
├── package.json
└── tsconfig.base.json
```

### SDK Generation Flow

1. `apps/backend` uses `tsoa` to define routes and generate OpenAPI spec (e.g., `/openapi.json`).
2. `packages/sdk` runs `openapi-typescript-codegen` to generate a TS client from the OpenAPI spec.
3. `apps/frontend` imports the generated client as a workspace dependency.

```ts
// Example frontend usage
import { UserApi } from "@my-org/sdk";

const api = new UserApi();
api.getUsers().then(console.log);
```

### SDK Generation Command Example

In `packages/sdk/package.json`:

```json
{
  "scripts": {
    "generate": "openapi -i ../apps/backend/openapi.json -o ./src -c"
  }
}
```

### AWS Architecture

```plantuml
@startuml
cloudfront "CloudFront (CDN)\napp.xyz.com" {
  rectangle "S3 Bucket (Frontend)" as S3
  rectangle "Path-based Routing: /api/* → ALB" as Proxy
}

rectangle "ALB (Internal HTTPS)" as ALB
rectangle "EC2 Instance\n(Express Backend)" as EC2

Proxy --> ALB
ALB --> EC2
S3 --> Proxy
@enduml
```

### CDK Stack Layout (infra/)

```bash
infra/
├── bin/
│   └── deploy.ts            # Entrypoint
├── lib/
│   ├── frontend-stack.ts    # S3 + CloudFront (frontend + API proxy)
│   ├── backend-stack.ts     # EC2 + internal ALB
│   └── cert-stack.ts        # ACM cert only (DNS managed in Vercel)
├── package.json
└── cdk.json
```

Each stack includes:

- `frontend-stack.ts`:
  - S3 bucket
  - CloudFront distribution with behavior: `/api/*` → ALB target
  - ACM cert (for app.xyz.com)
- `backend-stack.ts`:
  - VPC + EC2 instance
  - ALB (internal)
  - Security group allowing CloudFront IP range
- `cert-stack.ts`:
  - ACM certificate for `app.xyz.com`
  - DNS validation records will be **manually** added to Vercel

## Implementation

### Step-by-Step

1. **Bootstrap CDK Environment:**

   ```bash
   cdk bootstrap aws://<account>/<region>
   ```

2. **Deploy Stacks in Order:**

   ```bash
   cdk deploy CertStack
   # After cert DNS validated manually in Vercel:
   cdk deploy BackendStack
   cdk deploy FrontendStack
   ```

3. **CI/CD Setup (GitHub Actions)**

`.github/workflows/deploy.yml`

```yaml
name: Deploy Monorepo

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - name: Install dependencies
        run: pnpm install

      - name: Generate SDK
        run: pnpm --filter sdk generate

      - name: Build Frontend
        run: pnpm --filter frontend build

      - name: Build Backend
        run: pnpm --filter backend build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy CDK
        run: |
          npm install -g aws-cdk
          cd infra && pnpm install && cdk deploy --all --require-approval never
```

## Gathering Results

To validate deployment:

- Visit `https://app.xyz.com` to confirm frontend is served correctly.
- Test `/api/*` routes from browser/SDK to verify backend connectivity.
- Review AWS console to confirm infrastructure components are provisioned and healthy.

## Client Handover Guide

1. **Domain Configuration:**
   - Login to your domain registrar (e.g., Vercel or the provider you used).
   - Add/Update the following DNS record:
     - `CNAME app.xyz.com` → CloudFront distribution domain (provided after deploy)
   - If using ACM for TLS, add DNS validation records provided during `CertStack` deployment.

2. **CI/CD Pipeline:**
   - Any pushes to `main` branch trigger build & deploy automatically.
   - Ensure AWS credentials with `cdk deploy` access are configured in GitHub Secrets.

3. **Ongoing Maintenance:**
   - To regenerate the SDK after backend changes:
     ```bash
     pnpm --filter sdk generate
     ```
   - To manually redeploy infrastructure:
     ```bash
     cd infra && pnpm install && cdk deploy --all
     ```

4. **Post-Deployment Checks:**
   - Visit `https://app.xyz.com` to verify frontend load.
   - Call `https://app.xyz.com/api/*` endpoints from browser or SDK.

## Need Professional Help in Developing Your Architecture?

Please contact me at [sammuti.com](https://sammuti.com) :)
