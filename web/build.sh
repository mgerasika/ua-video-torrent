#for local testing/or local docker container
image=ua-video-torrent-web
container=ua-video-torrent-web
port=8006
#should coming from git commit hash
version=1
REACT_APP_ENV=local

docker stop $container
docker image rm $image
docker rm $container
docker build -t $image -f Dockerfile . --build-arg REACT_APP_GIT_COMMIT_HASH=$version --build-arg REACT_APP_ENV=$REACT_APP_ENV
docker run --env PORT=80 -d -p $port:80 --name $container $image
