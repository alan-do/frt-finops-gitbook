import json
import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.urlopen("https://mintlify.com/schema.json", context=ctx)
schema = json.loads(req.read())
nav = schema.get("properties", {}).get("navigation", {})
print("Navigation type:", nav.get("type"))
print("Navigation items:", json.dumps(nav.get("items", {}), indent=2)[:500])
