# Use EKSCTL to deploy FlixTube inside AWS EKS cluster

This page walks you through the steps required to deploy the [FlixTube](https://github.com/korenandr/flixtube) sample application inside AWS EKS cluster.

## Prerequisites

You need to install eksctl on your development computer. Also you need to have IAM AWS account with created s3 bucket.

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

3. Create EKS cluster.

    ```bash
    eksctl create cluster --name test-cluster --version 1.29 --region eu-north-1 --nodegroup-name linux-nodes --node-type t3.micro --nodes 10
    ```

4. Deploy application

    ```bash
    kubectl apply -f deploy/k8s/namespace.yaml
    kubectl create secret generic aws-keys --from-literal=STORAGE_ACCESS_KEY_ID=${STORAGE_ACCESS_KEY_ID} --from-literal=STORAGE_SECRET_ACCESS_KEY=${STORAGE_SECRET_ACCESS_KEY}
    kubectl apply -f deploy/k8s
    ```

5. Wait for the pods to be ready.

    ```bash
    kubectl get pods
    ```

    After a few minutes, you should see the Pods in a `Running` state:

   ```
   NAME                                     READY   STATUS    RESTARTS   AGE
   db-f67bfbd98-wlnvh                       1/1     Running   0          2m48s
   gateway-7f75c46f5f-pkxkg                 1/1     Running   0          2m48s
   history-6cc49779d-km4xm                  1/1     Running   0          2m48s
   metadata-56d4fc6cbb-992gk                1/1     Running   0          2m48s
   rabbit-85687f5ccb-sffgq                  1/1     Running   0          2m48s
   recommendations-7b7c7c7df6-wg6rw         1/1     Running   0          2m48s
   video-streaming-58db654b4-2nvsx          1/1     Running   0          2m48s
   videos-storage-5fd5d8c96f-2k6mh          1/1     Running   0          2m48s
   videos-uploader-6dc5b8c4dc-cth4h         1/1     Running   0          2m48s
   ```

6. Check your external ip address.

    ```bash
    kubectl describe ingress -n flixtube
    ```

7. Point your browser at that ip address http://<your external ip address>

## Clean up

1. Delete cluster.

    ```bash
    eksctl delete cluster --name test-cluster
    ```