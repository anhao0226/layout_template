package router

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"services/dbops"
	"services/defs"
	"services/defs/session"
	"services/model"
)

var GlobalSession *session.Manager

func initSessionManage() {
	var err error
	// session
	session.RegisterProvider("memory", session.NewMemoryProvider())
	GlobalSession, err = session.NewManager("memory", "user_session", 3600)
	if defs.HandleError(err) {
		return
	}
	go GlobalSession.SessionGC()
}


func RegisterUserRouter(app *gin.Engine, ) {

	initSessionManage()

	app.GET("/user/records", userRecords)
	app.GET("/user/info", userDetails)
	app.PUT("/user/info/edit", userinfoEdit)
	app.POST("/user/login", userLogin)
	app.PUT("/user//logout", userLogout)
	app.POST("/user/register", userRegister)
}


func userRegister(ctx *gin.Context) {
	user := model.User{
		Email:    ctx.PostForm("email"),
		Password: ctx.PostForm("password"),
	}
	db := dbops.Instance().Select("Email", "Password").Table("user")
	result := db.Create(&user)
	if defs.HandleError(result.Error) {
		ctx.JSON(http.StatusOK, defs.Ok.WithData(user, 1))
	} else {
		ctx.JSON(http.StatusOK, defs.ErrServer)
	}
}

func userLogin(ctx *gin.Context) {
	data := make(map[string]string)
	data["email"] = ctx.PostForm("email")
	data["password"] = ctx.PostForm("password")
	user := model.User{}
	db := dbops.Instance().Table("user").Where(data)
	if defs.HandleError(db.First(&user).Error) {
		// 创建session
		fmt.Println(user)
		sess := GlobalSession.SessionStart(ctx.Writer, ctx.Request)
		// 写入用户uid
		_ = sess.Set("uid", user.Uid)
		ctx.JSON(http.StatusOK, defs.Ok.WithData(user, 1))
	} else {
		ctx.JSON(http.StatusOK, defs.ErrServer)
	}
}

func userLogout(ctx *gin.Context) {
	GlobalSession.SessionDestroy(ctx.Writer, ctx.Request)
	ctx.JSON(http.StatusOK, defs.Ok)
}

func userDetails(ctx *gin.Context) {
	cookieName, err := ctx.Cookie("user_session")
	if defs.HandleError(err) && len(cookieName) > 0 {
		user := model.User{}
		sess := GlobalSession.SessionStart(ctx.Writer, ctx.Request)
		fmt.Println(sess.Get("uid"))
		uid := sess.Get("uid").(string)
		result := dbops.Instance().Table("user").Where("uid", uid).First(&user)

		if defs.HandleError(result.Error) {
			ctx.JSON(http.StatusOK, defs.Ok.WithData(user, 1))
		} else {
			ctx.JSON(http.StatusOK, defs.ErrServer)
		}
	} else {
		ctx.JSON(http.StatusOK, defs.ErrCredentialsExpired)
	}

}

func userinfoEdit(ctx *gin.Context) {
	data := make(map[string]interface{})
	keys := []string{"nickname", "gender", "age", "birthday"}
	for _, k := range keys {
		if v := ctx.Query(k); len(v) > 0 {
			data[k] = v
		}
	}
	sess := GlobalSession.SessionStart(ctx.Writer, ctx.Request)
	uid := sess.Get("uid").(string)
	user := model.User{}

	result := dbops.Instance().Table("user").Where("uid", uid).Updates(&data)
	fmt.Println(result)
	if defs.HandleError(result.Error) {
		ctx.JSON(http.StatusOK, defs.Ok.WithData(user, 1))
	} else {
		ctx.JSON(http.StatusOK, defs.ErrServer)
	}
}

func userRecords(ctx *gin.Context) {
	var users []model.User
	result := dbops.Instance().Table("user").Find(&users)
	if defs.HandleError(result.Error) {
		ctx.JSON(http.StatusOK, defs.Ok.WithData(users, len(users)))
	} else {
		ctx.JSON(http.StatusOK, defs.ErrServer)
	}
}
