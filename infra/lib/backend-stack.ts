import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_certificatemanager } from "aws-cdk-lib";

interface BackendStackProps extends cdk.StackProps {
  certificate: aws_certificatemanager.ICertificate;
}

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);
  }
}
