package errors

// errors
var (
	Ok                    = NewError("0000", "OK", true)
	ErrServer             = NewError("1002", "服务异常", false)
	ErrValidateParam      = NewError("1001", "参数验证失败", false)
	ErrRecordNotExist     = NewError("1003", "记录不存在", false)
	ErrNoPermission       = NewError("1004", "权限不足", false)
	ErrCredentialsExpired = NewError("1005", "登录凭证过期", false)
)
