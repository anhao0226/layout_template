package session

/**

 */
var providers = make(map[string]Provider)

/**
RegisterProvider
*/
func RegisterProvider(name string, provider Provider) {
	if provider == nil {
		panic("session: Register provider is nil")
	}
	if _, p := providers[name]; p {
		panic("session: Register provider is existed")
	}
	providers[name] = provider
}
