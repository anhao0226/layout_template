package dbops

import (
	"fmt"
	"gorm.io/driver/mysql"
	_ "gorm.io/driver/mysql"
	"gorm.io/gorm"
	_ "gorm.io/gorm"
)

const (
	//USERNAME = "remote"
	PASSWORD = "123456"
	//PASSWORD = "^W0xc9f10xd6ed"
	NETWORK  = "tcp"
	SERVER   = "localhost"
	PORT     = 3306
	DATABASE = "hangiangai"
)

var (
	//USERNAME = "remote"
	USERNAME = "root"
)

var (
	conn *gorm.DB
	err  error
)

func Init() {
	//if gin.Mode() == gin.DebugMode {
	//	USERNAME = "root"
	//}
	dsn := formatDsn()
	conn, err = gorm.Open(mysql.Open(dsn))
	if err != nil {
		panic(err)
	}
}

//
func Instance() *gorm.DB {
	return conn
}

func formatDsn() string {
	return fmt.Sprintf("%s:%s@%s(%s:%d)/%s?parseTime=true", USERNAME, PASSWORD, NETWORK, SERVER, PORT, DATABASE)
}
