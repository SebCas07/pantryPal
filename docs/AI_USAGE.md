# AI Usage

## Scaffolding

Claude produced the initial starter project and sprint plan. I adapted that scaffold branch by branch, replacing starter placeholders with the PantryPal Flask API, React interface, tests, containers, and Cloud Run deployment configuration.

## Copilot: PAN-7 filters

I used GitHub Copilot to suggest the combined name, category, and expiry-status filters for `GET /api/items`. The suggestion was reviewed and kept in this form:

```python
search = (request.args.get("q") or "").strip()
if search:
    query = query.filter(Item.name.ilike(f"%{search}%"))

category = (request.args.get("category") or "").strip().lower()
if category:
    if category not in CATEGORIES:
        return jsonify(errors={"category": f"Unknown category '{category}'."}), 400
    query = query.filter(Item.category == category)

items = query.order_by(
    Item.expiration_date.is_(None), Item.expiration_date, Item.name
).all()
results = [item.to_dict(_use_soon_days()) for item in items]

status = (request.args.get("status") or "").strip()
if status:
    results = [item for item in results if item["status"] == status]
```

I verified the behavior with 13 pytest tests, including case-insensitive name search and combined category/status filters.

## Debugging with AI

- **Flask startup:** Copilot initially generated the WSGI entry point with a misspelled `__main___` guard. I corrected it to `if __name__ == "__main__":` so Flask could start.
- **Vite proxy:** A local proxy used `localhost`, which did not reliably resolve in the Windows/container environment, and the configuration also contained a stray quote. I changed it to `http://127.0.0.1:5000` and removed the extra quote.
- **Nginx / Cloud Run loop:** The initial nginx template forwarded `/api/` back to the frontend host with `proxy_set_header Host $host`, causing an infinite proxy loop and `/api/health` to return `Rate exceeded`.
- **Fix:** I removed the bad host header and changed the upstream block to:

```nginx
location /api/ {
    proxy_pass ${API_UPSTREAM};
    proxy_ssl_server_name on;
}
```

## Where AI got it wrong

The starter nginx template included `proxy_set_header Host $host;`. That was genuine AI-generated code that needed fixing: on Cloud Run it sent the proxied API request back to itself rather than preserving the backend upstream host. Removing that header and enabling TLS server-name handling fixed the loop.
