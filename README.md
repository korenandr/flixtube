# Configuration

You need to specify environment variables:
```bash
EXPORT STORAGE_BUCKET_NAME=<your aws s3 bucket name>
EXPORT STORAGE_REGION_NAME=<your aws s3 region>
EXPORT STORAGE_ACCESS_KEY_ID=<your aws access key id>
EXPORT STORAGE_SECRET_ACCESS_KEY=<your aws secret access key>
```

# How to run locally

You need Docker and Docker-Compose installed to run this.

Boot it up from the terminal using:
```bash
docker compose -f docker-compose-prod.yml up --build
```

Add sample from db-fixture into your mongodb container

Then point your browser at http://localhost:4000/video?id=5d9e690ad76fe06a3d7ae416

To stop the microservices:
```bash
docker compose -f docker-compose-prod.yml down
```

# How to run inside minikube/eks cluster

Add STORAGE_BUCKET_NAME and STORAGE_REGION_NAME into deploy/video-storage-config.yml

Now you have to choose where you want to deploy your app (minikube or AWS).

## How to setup minikube cluster

You need minikube and kubectl installed to run this.

Launch local cluster:
```bash
minikube start --addons=ingress --cpus 4 --memory 4096 --namespace="flixtube"
```

## How to setup AWS EKS cluster

You need eksctl installed to run this.

Launch EKS cluster on AWS:
```bash
eksctl create cluster --name test-cluster --version 1.29 --region eu-north-1 --nodegroup-name linux-nodes --node-type t3.micro --nodes 10
```

# Deploy application
```bash
kubectl apply -f deploy/k8s/namespace.yml
kubectl create secret generic aws-keys --from-literal=STORAGE_ACCESS_KEY_ID=${STORAGE_ACCESS_KEY_ID} --from-literal=STORAGE_SECRET_ACCESS_KEY={STORAGE_SECRET_ACCESS_KEY}
kubectl apply -f deploy/k8s
```

# Clean up resources

## minikube cluster
```bash
minikube delete
```

## AWS EKS cluster
```bash
eksctl delete cluster --name test-cluster
```