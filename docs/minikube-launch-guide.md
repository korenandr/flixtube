# Use minikube to deploy FlixTube locally

This page walks you through the steps required to deploy the [FlixTube](https://github.com/korenandr/flixtube) sample application locally inside minikube cluster.

## Prerequisites

You need to install minikube on your development computer. Also you need to have IAM AWS account with created s3 bucket.

## Deploy the sample application

1. Clone the Github repository.

    ```bash
    git clone https://github.com/korenandr/flixtube.git
    ```

2. Specify environment variables:

    ```bash
    EXPORT STORAGE_BUCKET_NAME=<your aws s3 bucket name>
    EXPORT STORAGE_REGION_NAME=<your aws s3 region>
    EXPORT STORAGE_ACCESS_KEY_ID=<your aws access key id>
    EXPORT STORAGE_SECRET_ACCESS_KEY=<your aws secret access key>
    ```

3. Create minikube cluster.

    ```bash
    minikube start --addons=ingress --cpus 4 --memory 4096 --namespace="flixtube"
    ```

4. Deploy application

    ```bash
    kubectl apply -f deploy/k8s/namespace.yml
    kubectl create secret generic aws-keys --from-literal=STORAGE_ACCESS_KEY_ID=${STORAGE_ACCESS_KEY_ID} --from-literal=STORAGE_SECRET_ACCESS_KEY={STORAGE_SECRET_ACCESS_KEY}
    kubectl apply -f deploy/k8s
    ```

4. Point your browser at http://localhost:4000

## Clean up

1. Stop this app.

    ```bash
    minikube stop
    ```

2. Delete cluster.

    ```bash
    minikube delete
    ```