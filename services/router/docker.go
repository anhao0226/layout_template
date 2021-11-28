package router

import (
	"context"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
	"github.com/gin-gonic/gin"
	"net/http"
	"services/defs/errors"
)

func RegisterDockerRouter(app *gin.Engine) {


	cl, err := client.NewClientWithOpts()
	if !errors.HandleError(err) {
		panic(err)
	}

	app.GET("/docker/images", DockerImages(cl))
	app.GET("/docker/containers", DockerContainer(cl))
	app.PUT("/docker/kill", DockerCommand(cl))
}

func DockerCommand(cl *client.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		containerID := ctx.Query("dockerID")
		command := ctx.Query("command")
		var err error
		switch command {
		case "stop":
			err = cl.ContainerKill(context.Background(), containerID, "")
		case "start":
			err = cl.ContainerStart(context.Background(), containerID, types.ContainerStartOptions{})
		}

		if errors.HandleError(err) {
			ctx.JSON(http.StatusOK, errors.Ok)
		} else {
			ctx.JSON(http.StatusOK, errors.ErrServer)
		}
	}
}

func DockerImages(cl *client.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		list, err := cl.ImageList(context.Background(), types.ImageListOptions{})
		if errors.HandleError(err) {
			ctx.JSON(http.StatusOK, errors.Ok.WithData(list, 0))
		} else {
			ctx.JSON(http.StatusOK, errors.ErrServer)
		}
	}
}

func DockerContainer(cl *client.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		list, err := cl.ContainerList(context.Background(), types.ContainerListOptions{All: true})
		if errors.HandleError(err) {
			ctx.JSON(http.StatusOK, errors.Ok.WithData(list, 0))
		} else {
			ctx.JSON(http.StatusOK, errors.ErrServer)
		}
	}
}
