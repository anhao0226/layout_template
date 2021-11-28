package session

import (
	"container/list"
	"sync"
	"time"
)


/**

 */
type FromMemory struct {
	lock     sync.Mutex
	sessions map[string]*list.Element
	list     *list.List
}

func NewMemoryProvider() Provider {
	return &FromMemory{
		list: list.New(),
		sessions: make(map[string]*list.Element),
	}
}

/**

 */
func (memory *FromMemory) Check(sid string) (bool, Session) {
	if ele, ok := memory.sessions[sid]; ok {
		return true, ele.Value.(*session)
	}
	return false, nil
}

/**

 */
func (memory *FromMemory) SessionInit(sid string) (Session, error) {
	memory.lock.Lock()
	defer memory.lock.Unlock()
	newSess := NewSession(memory, sid)
	element := memory.list.PushBack(newSess)
	memory.sessions[sid] = element
	return newSess, nil
}

/**

 */
func (memory *FromMemory) SessionRead(sid string) (Session, error) {
	if exist, sess := memory.Check(sid); exist {
		return sess, nil
	}
	return memory.SessionInit(sid)
}

/**

 */
func (memory *FromMemory) SessionDestroy(sid string) error {
	if ele, ok := memory.sessions[sid]; ok {
		delete(memory.sessions, sid)
		memory.list.Remove(ele)
		return nil
	}
	return nil
}

/**

 */
func (memory *FromMemory) SessionGC(maxLifeTime int64) {
	memory.lock.Lock()
	defer memory.lock.Unlock()
	for {
		ele := memory.list.Back()
		if ele == nil {
			break
		}
		if (ele.Value.(*session).LastAccessedTime.Unix() + maxLifeTime) < time.Now().Unix() {
			memory.list.Remove(ele)
			delete(memory.sessions, ele.Value.(*session).sid)
		} else {
			break
		}
	}
}

/**

 */
func (memory *FromMemory) SessionUpdate(sid string) error {
	memory.lock.Lock()
	defer memory.lock.Unlock()
	if ele, ok := memory.sessions[sid]; ok {
		ele.Value.(*session).LastAccessedTime = time.Now()
		memory.list.MoveToFront(ele)
		return nil
	}
	return nil
}
