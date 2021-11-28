package model

import "time"

type User struct {
	ID        int       `json:"id"`
	Uid       string    `json:"uid"`
	Age       int       `json:"age"`
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	Gender    int       `json:"gender"`
	Birthday  time.Time `json:"birthday"`
	Nickname  string    `json:"nickname"`
	CreatedAt time.Time `json:"created_at"`
}
