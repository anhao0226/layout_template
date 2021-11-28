package middle

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"services/defs"
	"services/router"
)

/*
	Cors
*/
func Cors(ctx *gin.Context) {

	ctx.Header("Access-Control-Allow-Origin", "http://0.0.0.0")
	ctx.Header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTION")
	ctx.Header("Access-Control-Allow-Headers", "Content-Type,Authorization,UserId")
	ctx.Header("Access-Control-Max-Age", "3600")
	ctx.Header("Access-Control-Allow-Credentials", "true")

	if gin.Mode() == gin.DebugMode {
		ctx.Header("Access-Control-Allow-Origin", "http://localhost:8080")
	}

	if ctx.Request.Method == http.MethodOptions {
		ctx.AbortWithStatus(http.StatusNoContent)
	}
	ctx.Next()
}

func Authentication(whiteList *defs.Array) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		if !whiteList.Includes(ctx.FullPath()) {
			v, err := ctx.Cookie("user_session")
			if !defs.HandleError(err) || len(v) == 0 {
				ctx.JSON(http.StatusOK, defs.ErrCredentialsExpired)
				ctx.Abort()
				return
			}

			if exist, _ := router.GlobalSession.Check(v); !exist {
				ctx.JSON(http.StatusOK, defs.ErrCredentialsExpired)
				ctx.Abort()
				return
			}
		}
		ctx.Next()
	}
}
