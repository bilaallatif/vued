#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { InfraStack } from "../lib/infra-stack";
import { FrontendStack } from "../lib/frontend-stack";
import { TestStack } from "../lib/test-stack";
import { CertStack } from "../lib/cert-stack";

const app = new cdk.App();

// Generate/Reference certificate
const cert_stack = new CertStack(app, "CertStack", {
  env: { account: "928747726543", region: "eu-west-2" },
});

new FrontendStack(app, "FrontendStack", {
  env: { account: "928747726543", region: "eu-west-2" },
  certificate: cert_stack.certificate,
});
