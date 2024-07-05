import redis

r = redis.Redis(host='localhost', port=6379, decode_responses=True)
print(r.ping())
r.set('foo', 'bar')
print(r.get('foo'))
r.set('a:b', 1)
print(r.get('a:b'))
print(r.get('unknown'))