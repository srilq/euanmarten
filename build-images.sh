which yum > /dev/null && yum install GraphicsMagick
yarn
NODE_ENV=ci yarn build:images
echo "build-images.sh Success."
