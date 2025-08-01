import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  aws_ec2,
  aws_ecs,
  aws_ecs_patterns,
  aws_elasticloadbalancingv2,
} from "aws-cdk-lib";

// interface BackendStackProps extends cdk.StackProps {
//   certificate: aws_certificatemanager.ICertificate;
// }

export class BackendStack extends cdk.Stack {
  public readonly load_balancer: aws_elasticloadbalancingv2.ApplicationLoadBalancer;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create VPC
    const vpc = new aws_ec2.Vpc(this, "BackendVpc", {
      maxAzs: 2,
    });
    vpc.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    // Create cluster
    const cluster = new aws_ecs.Cluster(this, "BackendCluster", {
      vpc: vpc,
    });
    cluster.addCapacity("BackendClusterCapacity", {
      minCapacity: 1,
      maxCapacity: 1,
      instanceType: new aws_ec2.InstanceType("t3.small"),
      machineImage: aws_ecs.EcsOptimizedImage.amazonLinux2(),
    });
    cluster.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    // Provision backend service
    const service = new aws_ecs_patterns.ApplicationLoadBalancedEc2Service(
      this,
      "BackendService",
      {
        // if cluster and vpc omitted, automatically creates a vpc with 2AZ's and one cluster inside it
        cluster: cluster,

        memoryLimitMiB: 1024,
        cpu: 256, // 0.25 vCPU
        taskImageOptions: {
          image: aws_ecs.ContainerImage.fromAsset("../apps/backend"),
          environment: {
            PORT: "3000",
            NODE_ENV: "development",
          },
          containerPort: 3000,
        },
        desiredCount: 1,
      },
    );
    service.service.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    service.listener.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    service.taskDefinition.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    service.loadBalancer.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    this.load_balancer = service.loadBalancer;
  }
}
