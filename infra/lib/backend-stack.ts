import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  aws_certificatemanager,
  aws_ec2,
  aws_ecs,
  aws_ecs_patterns,
  aws_elasticloadbalancingv2,
} from "aws-cdk-lib";

interface BackendStackProps extends cdk.StackProps {
  certificate: aws_certificatemanager.ICertificate;
}

export class BackendStack extends cdk.Stack {
  public readonly load_balancer: aws_elasticloadbalancingv2.ApplicationLoadBalancer;

  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    // Create VPC
    const vpc = new aws_ec2.Vpc(this, "BackendVpc", {
      maxAzs: 2,
    });

    // Create cluster
    const cluster = new aws_ecs.Cluster(this, "BackendCluster", {
      vpc: vpc,
    });
    cluster.addCapacity("BackendClusterCapacity", {
      minCapacity: 1,
      maxCapacity: 1,
      instanceType: new aws_ec2.InstanceType("t4g.micro"),
      machineImage: aws_ecs.EcsOptimizedImage.amazonLinux2(
        aws_ecs.AmiHardwareType.ARM,
      ),
    });

    // Provision backend service
    const service = new aws_ecs_patterns.ApplicationLoadBalancedEc2Service(
      this,
      "BackendService",
      {
        cluster: cluster,
        certificate: props.certificate,
        memoryLimitMiB: 512,
        cpu: 256, // 0.25 vCPU
        taskImageOptions: {
          image: aws_ecs.ContainerImage.fromAsset("../apps/backend/"),
          environment: {
            PORT: "3000",
            NODE_ENV: "development",
          },
          containerPort: 80,
        },
        desiredCount: 1,
      },
    );

    this.load_balancer = service.loadBalancer;
  }
}
