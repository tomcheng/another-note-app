var CACHE = "NOTORIST_V1";

self.addEventListener("fetch", function (event) {
  console.log("The service worker is serving the asset.");

  if (shouldCache(event.request)) {
    event.respondWith(fromCache(event.request).catch(function () {
      console.log("Not in cache.", event.request.url);
      return caches.open(CACHE).then(function (cache) {
        return fetch(event.request).then(function (response) {
          console.log("Putting the new request in cache.", event.request.url);
          cache.put(event.request, response.clone());
          return response;
        }).catch(function () {
          console.log("Request failed.")
        });
      });
    }));
  } else {
    console.log("Not caching.", event.request.url);
    return fetch(event.request);
  }
});

function fromCache (request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (cachedResponse) {
      if (cachedResponse) { console.log("Found in cache.", request.url); }
      return cachedResponse || Promise.reject("No match");
    });
  });
}

function shouldCache (request) {
  if (request.url.match(/sockjs-node/)) { return false; }

  return true;
}
