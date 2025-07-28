# Backend Build
* `pnpm build` - build routes and OpenAPI spec + transpile into js
* `pnpm build:sdk` - build api sdk from backend
* `docker build -t backend dist` - build container from backend

# Frontend Build
* `pnpm build` - build static site

# Certificate Issuing
* Attempted to create a CDK stack for this but had trouble
* For now have requested a certificate for *.bilaallatif.com manually
* Manually added to Vercel DNS:
  * CAA record for AWS in Vercel '0 issue "amazon.com"'
  * CNAME record for CNAME name (everything before .)
  * CNAME value (exactly as generated)
* Since this process is more understood may attempt to re-create stack for this

# Infrastructure Deployment
* Currently, requires certificate to be created manually and add ARN (see above)
* During deployment, we see an output for the CDN domain name
  * We must add a DNS record manually to Vercel such that we can redirect vued.bilaallatif.com to CloudFront
  * i.e. vued CNAME xyz.cloudfront.net.
  * Note, this would be cool to automate in CI/CD