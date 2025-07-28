import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  aws_certificatemanager,
  aws_cloudfront,
  aws_cloudfront_origins,
  aws_s3,
  aws_s3_deployment,
  CfnOutput,
} from "aws-cdk-lib";

interface FrontendStackProps extends cdk.StackProps {
  certificate: aws_certificatemanager.ICertificate;
}

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, props);

    // Create S3 bucket to host static website
    const bucket = new aws_s3.Bucket(this, "FrontendBucket", {
      bucketName: "vued.bilaallatif.com",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: true,
      blockPublicAccess: new aws_s3.BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }),
      versioned: true,
      websiteIndexDocument: "index.html",
    });

    // Deploy static site to bucket
    new aws_s3_deployment.BucketDeployment(this, "DeployFrontend", {
      sources: [aws_s3_deployment.Source.asset("../apps/frontend/dist")],
      destinationBucket: bucket,
    });

    // Create CloudFront dist
    const cdn = new aws_cloudfront.Distribution(this, "FrontendCDN", {
      domainNames: ["vued.bilaallatif.com"],
      defaultBehavior: {
        origin: new aws_cloudfront_origins.HttpOrigin(
          bucket.bucketWebsiteDomainName,
          {
            protocolPolicy: aws_cloudfront.OriginProtocolPolicy.HTTP_ONLY,
            httpPort: 80,
            httpsPort: 443,
          },
        ),
        allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        compress: true,
      },
      certificate: props.certificate,
      priceClass: aws_cloudfront.PriceClass.PRICE_CLASS_100,
    });

    // Output domain name
    new CfnOutput(this, "CDNDomainName", {
      value: cdn.domainName,
    });
  }
}
