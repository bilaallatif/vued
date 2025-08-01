import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_certificatemanager } from "aws-cdk-lib";

export class FrontendCertStack extends cdk.Stack {
  public readonly certificate: aws_certificatemanager.ICertificate;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Auto generation
    // this.certificate = new aws_certificatemanager.Certificate(
    //   this,
    //   "VuedCert",
    //   {
    //     domainName: "vued.bilaallatif.com",
    //     subjectAlternativeNames: ["*.vued.bilaallatif.com"],
    //     validation: aws_certificatemanager.CertificateValidation.fromDns(),
    //   },
    // );

    const certificate_ARN =
      "arn:aws:acm:us-east-1:928747726543:certificate/7c53e8e1-e701-492a-a107-94c1b2ba7b64";

    // Create reference to certificate
    this.certificate = aws_certificatemanager.Certificate.fromCertificateArn(
      this,
      "VuedCertFrontend",
      certificate_ARN,
    );
  }
}
