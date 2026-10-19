// PROJECT ICHOR - push receiver. Sending server is not connected yet.
self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) {}
  const title = data.sender === 'MYO' ? 'MYO' : data.sender === 'ICHOR' ? 'ICHOR' : 'PROJECT ICHOR';
  const body = typeof data.text === 'string' ? data.text.slice(0, 1000) : '새 메시지가 도착했습니다.';
  event.waitUntil(self.registration.showNotification(title, {
    body, icon: './icon-192.png', badge: './icon-192.png',
    tag: data.messageId ? String(data.messageId) : undefined,
    data: {url: './?page=message'}
  }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const url = new URL('./?page=message', self.registration.scope).href;
    const clientsList = await clients.matchAll({type:'window', includeUncontrolled:true});
    for (const client of clientsList) {
      if (client.url.startsWith(self.registration.scope)) {
        await client.focus();
        if ('navigate' in client) await client.navigate(url);
        return;
      }
    }
    await clients.openWindow(url);
  })());
});
