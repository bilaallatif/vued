#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { FrontendStack } from "../lib/frontend-stack";
import { FrontendCertStack } from "../lib/frontend-cert-stack";
import { BackendStack } from "../lib/backend-stack";
import { BackendCertStack } from "../lib/backend-cert-stack";

const app = new cdk.App();

// Generate/Reference certificate (eu-west-2 cert)
const backend_cert_stack = new BackendCertStack(app, "BackendCertStack", {
  env: { account: "928747726543", region: "eu-west-2" },
});

const backend_stack = new BackendStack(app, "BackendStack", {
  env: { account: "928747726543", region: "eu-west-2" },
  certificate: backend_cert_stack.certificate,
});

// Generate/Reference certificate (us-west-1 cert)
const frontend_cert_stack = new FrontendCertStack(app, "FrontendCertStack", {
  env: { account: "928747726543", region: "eu-west-2" },
});

const frontend_stack = new FrontendStack(app, "FrontendStack", {
  env: { account: "928747726543", region: "eu-west-2" },
  certificate: frontend_cert_stack.certificate,
  backend_load_balancer: backend_stack.load_balancer,
});
