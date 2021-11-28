package defs

type Array struct {
	Size  int
	value []interface{}
}

func NewArray(len int) *Array {
	return &Array{
		Size:  0,
		value: make([]interface{}, len),
	}
}

func (arr *Array) Push(v interface{}) {
	arr.value[arr.Size] = v
	arr.Size++
}

func (arr *Array) Length() int {
	return arr.Size
}

func (arr *Array) Includes(searchElement interface{}) bool {
	for _, ele := range arr.value {
		if ele == searchElement {
			return true
		}
	}
	return false
}
