package session

import (
	"time"
)

type session struct {
	sid              string
	value            map[interface{}]interface{}
	LastAccessedTime time.Time
	provider         Provider
}

func NewSession(provider Provider, sid string) Session {
	return &session{
		provider:         provider,
		sid:              sid,
		LastAccessedTime: time.Now(),
	}
}

func (s *session) initValue() {
	if s.value == nil {
		s.value = make(map[interface{}]interface{})
	}
}

func (s *session) Set(key, value interface{}) error {
	s.initValue()
	s.value[key] = value
	_ = s.provider.SessionUpdate(s.sid)
	return nil
}

func (s *session) Get(key interface{}) interface{} {
	s.initValue()
	if v, ok := s.value[key]; ok {
		_ = s.provider.SessionUpdate(s.sid)
		return v
	}
	return nil
}

func (s *session) Delete(key interface{}) error {
	s.initValue()
	delete(s.value, key)
	_ = s.provider.SessionUpdate(s.sid)
	return nil
}

func (s *session) SessionID() string {
	return s.sid
}
