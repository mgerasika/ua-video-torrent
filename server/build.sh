#for local testing/or local docker container
image=ua-video-torrent-server
container=ua-video-torrent-server
port=8005

docker stop $container
docker rm $container
docker image rm $image
docker build -t $image -f Dockerfile . --build-arg PORT=$port
docker run --network=host --restart=always --env PORT=8005 -v /home:/home -d -p $port:8005 --env-file=.env --name $container $image