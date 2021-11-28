package main

import (
	"github.com/gin-gonic/gin"
	"services/dbops"
	"services/defs"
	"services/middle"
	"services/router"
)

func main() {

	// mysql
	dbops.Init()

	app := gin.New()

	// 跨域中间件
	app.Use(middle.Cors)

	// 鉴权白名单
	whiteList := defs.NewArray(3)
	whiteList.Push("/user/login")
	whiteList.Push("/user/register")
	app.Use(middle.Authentication(whiteList))

	// 日志记录
	app.Use(gin.Logger())

	// 路由注册
	router.RegisterDockerRouter(app)
	router.RegisterUserRouter(app)

	_ = app.Run(":8088")
}
