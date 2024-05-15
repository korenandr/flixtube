#
# Publishes a Docker image.
#
# Environment variables:
#
#   CONTAINER_REGISTRY - The hostname of your container registry.
#   VERSION - The version number to tag the images with.
#
# Usage:
#
#       ./deploy/push-image.sh
#

set -u # or set -o nounset
: "$CONTAINER_REGISTRY"
: "$VERSION"

docker push $CONTAINER_REGISTRY/video-streaming:$VERSION