#
# Builds a Docker image.
#
# Environment variables:
#
#   CONTAINER_REGISTRY - The hostname of your container registry.
#   VERSION - The version number to tag the images with.
#
# Parameters:
#
#   $1 - The name of the service to build the image for.
#
# Usage:
#
#       ./deploy/build-image.sh service-name
#

if [ -z "$1" ]
then
    echo "Error: No service name provided. Please provide a service name as the first parameter."
    exit 1
fi

SERVICE_NAME=$1

set -u # or set -o nounset
: "$SERVICE_NAME"
: "$CONTAINER_REGISTRY"
: "$VERSION"

docker build -t ${CONTAINER_REGISTRY}/${SERVICE_NAME}:${VERSION} --file ./services/${SERVICE_NAME}/Dockerfile-prod ./services/${SERVICE_NAME}