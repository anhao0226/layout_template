CGO_ENABLED=0 go build -a -ldflags '-extldflags "-static"'
scp -r services root@123.57.239.39:/root/$1
rm -rf services