package defs

import (
	"database/sql"
	"log"
)

func HandleError(err2 error) bool {
	if err2 != nil && err2 != sql.ErrNoRows {
		log.Println(err2)
		return false
	}
	return true
}

var (
	Ok                = NewError("0000", "OK", true)
	ErrServer         = NewError("1002", "服务异常", false)
	ErrValidateParam  = NewError("1001", "参数验证失败", false)
	ErrRecordNotExist = NewError("1003", "记录不存在", false)
	ErrNoPermission   = NewError("1004", "权限不足", false)
	ErrCredentialsExpired = NewError("1005", "登录凭证过期", false)
)

var _ Error = (*err)(nil)

type err struct {
	Code    string      `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
	Count   int         `json:"count"`
	Success bool        `json:"success"`
}

type Error interface {
	WithData(v interface{}, count int) Error
	ToString()
}

func (e *err) WithData(v interface{}, count int) Error {
	e.Data = v
	e.Count = count
	return e
}

func (e *err) ToString() {

}

func NewError(code string, msg string, success bool) Error {
	return &err{
		Code:    code,
		Message: msg,
		Data:    nil,
		Success: success,
	}
}







var (

)
