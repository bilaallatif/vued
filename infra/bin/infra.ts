#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { FrontendStack } from "../lib/frontend-stack";
import { FrontendCertStack } from "../lib/frontend-cert-stack";
import { BackendStack } from "../lib/backend-stack";

const app = new cdk.App();

// ECS ApplicationLoadBalancedEc2Service
const backend_stack = new BackendStack(app, "BackendStack", {
  env: { account: "928747726543", region: "eu-west-2" },
});

// Generate/Reference certificate (us-west-1 cert)
const frontend_cert_stack = new FrontendCertStack(app, "FrontendCertStack", {
  env: { account: "928747726543", region: "eu-west-2" },
});

// CloudFront + S3
const frontend_stack = new FrontendStack(app, "FrontendStack", {
  env: { account: "928747726543", region: "eu-west-2" },
  certificate: frontend_cert_stack.certificate,
  backend_load_balancer: backend_stack.load_balancer,
});
