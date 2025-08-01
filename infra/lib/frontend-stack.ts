import * as cdk from "aws-cdk-lib";
import {
  aws_certificatemanager,
  aws_cloudfront,
  aws_cloudfront_origins,
  aws_elasticloadbalancingv2,
  aws_s3,
  aws_s3_deployment,
  CfnOutput,
  RemovalPolicy,
} from "aws-cdk-lib";
import { Construct } from "constructs";

interface FrontendStackProps extends cdk.StackProps {
  certificate: aws_certificatemanager.ICertificate;
  backend_load_balancer: aws_elasticloadbalancingv2.ApplicationLoadBalancer;
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
      retainOnDelete: false,
      destinationBucket: bucket,
    });

    // Create CloudFront dist
    const cdn = new aws_cloudfront.Distribution(this, "FrontendCDN", {
      domainNames: ["vued.bilaallatif.com"],
      certificate: props.certificate,
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
      additionalBehaviors: {
        "/api/*": {
          origin: new aws_cloudfront_origins.LoadBalancerV2Origin(
            props.backend_load_balancer,
            {
              protocolPolicy: aws_cloudfront.OriginProtocolPolicy.HTTP_ONLY,
            },
          ),
          functionAssociations: [
            {
              eventType: aws_cloudfront.FunctionEventType.VIEWER_REQUEST,
              function: new aws_cloudfront.Function(this, "StripApiPrefix", {
                // Escaping '/' doesn't translate to cloudfront
                // todo: find better way to do this
                code: aws_cloudfront.FunctionCode.fromInline(
                  `function handler(event) {
                    var request = event.request;
                    request.uri = request.uri.replace(/^\/api/, '');
                    return request;
                  }`,
                ),
              }),
            },
          ],
          allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_ALL,
          originRequestPolicy: aws_cloudfront.OriginRequestPolicy.ALL_VIEWER,
          cachePolicy: aws_cloudfront.CachePolicy.CACHING_DISABLED,
        },
      },
      priceClass: aws_cloudfront.PriceClass.PRICE_CLASS_100,
    });
    cdn.applyRemovalPolicy(RemovalPolicy.DESTROY);

    // Output domain name
    new CfnOutput(this, "CDNDomainName", {
      value: cdn.domainName,
    });
  }
}
