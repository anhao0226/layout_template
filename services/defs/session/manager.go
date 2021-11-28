package session

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"sync"
	"time"
)

type Manager struct {
	cookieName  string     //cookie的名称
	lock        sync.Mutex //锁，保证并发时数据的安全一致
	provider    Provider   //管理session
	maxLifeTime int64      //超时时间
}

func NewManager(providerName, cookieName string, maxLifetime int64) (*Manager, error) {
	provider, ok := providers[providerName]
	if !ok {
		return nil, fmt.Errorf("session: unknown provide %q (forgotten import?)", providerName)
	}
	manager := &Manager{
		cookieName:  cookieName,
		maxLifeTime: maxLifetime,
		provider:    provider,
	}
	return manager, nil
}

func (manager *Manager) sessionId() string {
	b := make([]byte, 32)
	if _, err := io.ReadFull(rand.Reader, b); err != nil {
		return ""
	}
	return base64.URLEncoding.EncodeToString(b)
}

func (manager *Manager) Session(sid string) {
	_, _ = manager.provider.SessionRead(sid)
}

func (manager *Manager) SessionStart(w http.ResponseWriter, r *http.Request) (session Session) {
	manager.lock.Lock()
	defer manager.lock.Unlock()
	cookie, err := r.Cookie(manager.cookieName)
	if err != nil || cookie.Value == "" {
		sid := manager.sessionId()
		session, _ = manager.provider.SessionInit(sid)
		cookie := http.Cookie{
			Name:     manager.cookieName,
			Value:    url.QueryEscape(sid),
			Path:     "/",
			HttpOnly: true,
			MaxAge:   int(manager.maxLifeTime),
		}
		http.SetCookie(w, &cookie)
	} else {
		sid, _ := url.QueryUnescape(cookie.Value)
		session, _ = manager.provider.SessionRead(sid)
	}
	return
}

func (manager *Manager) SessionDestroy(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie(manager.cookieName)
	if err != nil || cookie.Value == "" {
		return
	}

	manager.lock.Lock()
	defer manager.lock.Unlock()

	_ = manager.provider.SessionDestroy(cookie.Value)
	expiredTime := time.Now()
	newCookie := http.Cookie{
		Name: manager.cookieName,
		Path: "/", HttpOnly: true,
		Expires: expiredTime,
		MaxAge:  -1, //会话级cookie
	}
	http.SetCookie(w, &newCookie)
}

func (manager *Manager) SessionGC() {
	manager.lock.Lock()
	defer manager.lock.Unlock()
	manager.provider.SessionGC(manager.maxLifeTime)
	time.AfterFunc(time.Duration(manager.maxLifeTime)*time.Second, func() {
		manager.SessionGC()
	})
}

func (manager *Manager) Check(sid string) (bool, Session) {
	return manager.provider.Check(sid)
}
