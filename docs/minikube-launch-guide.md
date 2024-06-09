# Use minikube to deploy FlixTube locally

This page walks you through the steps required to deploy the [FlixTube](https://github.com/korenandr/flixtube) sample application locally inside minikube cluster.

## Prerequisites

You need to install on your development computer:

1. [Minikube](https://minikube.sigs.k8s.io/docs/)
2. [Istio service mesh](https://github.com/istio/istio/releases)
3. Also you need to have IAM AWS account with created s3 bucket.

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
    minikube start --cpus 4 --memory 6144 --namespace="flixtube"
    ```

4. Install the Istio components into Kubernetes

    ```bash
    istioctl install --set profile=demo -y
    ```

5. Check successfull installation of service mesh components

    ```bash
    istioctl verify-install
    kubectl get pod -n istio-system
    ```

    You should see something like this:

    ```
    Istio is installed and verified successfully
    NAME                                     READY   STATUS    RESTARTS   AGE
    istio-egressgateway-6d69dddff5-mqh7l     1/1     Running   0          2m48s
    istio-ingressgateway-749fbd8f49-tsg7p    1/1     Running   0          2m48s
    istiod-7797d66567-5nqng                  1/1     Running   0          2m48s
    ```

6. Enable automatic injection with the sidecar deployment of the Istio service proxy and a few additional components

    ```bash
    kubectl apply -f deploy/k8s/namespace.yaml
    kubectl config set-context $(kubectl config current-context) --namespace=flixtube
    kubectl label namespace flixtube istio-injection=enabled
    ```

7. Deploy application

    ```bash
    kubectl create secret generic aws-keys --from-literal=STORAGE_ACCESS_KEY_ID=${STORAGE_ACCESS_KEY_ID} --from-literal=STORAGE_SECRET_ACCESS_KEY=${STORAGE_SECRET_ACCESS_KEY}
    kubectl apply -f deploy/k8s
    ```
    
8. Wait for the pods to be ready.

    ```bash
    kubectl get pods -w
    ```

    After a few minutes, you should see the Pods in a `Running` state:

   ```
   NAME                                     READY   STATUS    RESTARTS   AGE
   db-f67bfbd98-wlnvh                       2/2     Running   0          2m48s
   gateway-7f75c46f5f-pkxkg                 2/2     Running   0          2m48s
   history-6cc49779d-km4xm                  2/2     Running   0          2m48s
   metadata-56d4fc6cbb-992gk                2/2     Running   0          2m48s
   rabbit-85687f5ccb-sffgq                  2/2     Running   0          2m48s
   recommendations-7b7c7c7df6-wg6rw         2/2     Running   0          2m48s
   video-streaming-58db654b4-2nvsx          2/2     Running   0          2m48s
   videos-storage-5fd5d8c96f-2k6mh          2/2     Running   0          2m48s
   videos-uploader-6dc5b8c4dc-cth4h         2/2     Running   0          2m48s
   ```

9. Create tunnel from your development machine to the cluster

    ```bash
    minikube tunnel
    ```

10. Check external ip address of gateway service

    ```bash
    kubectl -n istio-system get svc istio-ingressgateway
    ```

11. Point your browser at that ip address http://<external ip address>

## Clean up

1. Stop this app.

    ```bash
    minikube stop
    ```

2. Delete cluster.

    ```bash
    minikube delete
    ```