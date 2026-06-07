const DEFAULT_CACHE_TTL = 600;

const cacheStore = new Map();

export function getCache(key) {
  const item = cacheStore.get(key);
  
  if (!item) {
    return null;
  }

  const now = Date.now();
  if (now > item.expireTime) {
    cacheStore.delete(key);
    return null;
  }

  return item.value;
}

export function setCache(key, value, ttlSec) {
  const ttl = ttlSec || parseInt(process.env.CACHE_TTL) || DEFAULT_CACHE_TTL;
  const expireTime = Date.now() + (ttl * 1000);

  cacheStore.set(key, {
    value: value,
    expireTime: expireTime
  });
}

export function hasCache(key) {
  const item = cacheStore.get(key);
  
  if (!item) {
    return false;
  }

  const now = Date.now();
  if (now > item.expireTime) {
    cacheStore.delete(key);
    return false;
  }

  return true;
}

export function deleteCache(key) {
  cacheStore.delete(key);
}

export function clearCache() {
  cacheStore.clear();
}

export function getCacheStats() {
  let validCount = 0;
  let expiredCount = 0;
  const now = Date.now();

  cacheStore.forEach((item, key) => {
    if (now > item.expireTime) {
      expiredCount++;
    } else {
      validCount++;
    }
  });

  return {
    total: cacheStore.size,
    valid: validCount,
    expired: expiredCount
  };
}