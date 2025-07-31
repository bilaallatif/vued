import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_certificatemanager } from "aws-cdk-lib";

export class BackendCertStack extends cdk.Stack {
  public readonly certificate: aws_certificatemanager.ICertificate;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const certificate_ARN =
      "arn:aws:acm:eu-west-2:928747726543:certificate/4baf4825-c245-4cea-b442-951728ccf4fc";

    // Create reference to certificate
    this.certificate = aws_certificatemanager.Certificate.fromCertificateArn(
      this,
      "VuedCertBackend",
      certificate_ARN,
    );
  }
}
