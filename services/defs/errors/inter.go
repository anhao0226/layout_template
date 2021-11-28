package errors

import (
	"database/sql"
	"log"
)

var _ Error = (*err)(nil)


type Error interface {
	WithData(v interface{}, count int) Error
	ToString()
}

type err struct {
	Code    string      `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
	Count   int         `json:"count"`
	Success bool        `json:"success"`
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

func HandleError(err2 error) bool {
	if err2 != nil && err2 != sql.ErrNoRows {
		log.Println(err2)
		return false
	}
	return true
}
