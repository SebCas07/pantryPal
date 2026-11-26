from datetime import date, timedelta
from app.models import expiry_status

def days_from_now(n): 
    return (date.today() + timedelta(days=n)).isoformat()

def add(client, **fields): 
    payload = { "name": "Milk", "quantity": 1, "category": "dairy"} 
    payload.update(fields)
    return client.post("/api/items", json=payload)

def test_health(client):
    assert client.get("/api/health").get_json() =={"status": "ok"}

def test_create_and_list_item(client): 
    res = add(client, expiration_date=days_from_now(2))
    assert res.status_code == 201
    item = res.get_json()
    assert item["name"] == "Milk"
    assert item["status"] == "use_soon"

    listed = client.get("/api/items")
    assert listed.status_code == 200
    assert listed.get_json()[0]["id"] == item["id"]

def test_create_requires_name(client): 
    res =  client.post("/api/items", json={"quantity": 1})
    assert res.status_code == 400
    assert "name" in res.get_json()["errors"]

def test_rejects_bad_date_and_category(client): 
    res = add(client, expiration_date="next tuesday", category="toys")
    assert res.status_code == 400
    assert "expiration_date" in res.get_json()["errors"]
    assert "category" in res.get_json()["errors"]

def test_update_item(client):
    item_id = add(client).get_json()["id"]
    res = client.put(f"/api/items/{item_id}", json={"name": "Skim Milk", "quantity": 2})
    assert res.status_code == 200
    assert res.get_json()["name"] == "Skim Milk"
    assert res.get_json()["quantity"] == 2

def test_delete_item(client):
    item_id = add(client).get_json()["id"]
    res = client.delete(f"/api/items/{item_id}")
    assert res.status_code == 204
    assert client.get(f"/api/items/{item_id}").status_code == 404

def test_items_sorted_by_expiration(client):
    add(client, name="Rice")  # no date -> last
    add(client, name="Yogurt", expiration_date=days_from_now(5))
    add(client, name="Cheese", expiration_date=days_from_now(2))

    names = [item["name"] for item in client.get("/api/items").get_json()]
    assert names == ["Cheese", "Yogurt", "Rice"]

def test_dashboard_counts_and_use_soon(client):
    add(client, name="Old bread", expiration_date=days_from_now(-1))
    add(client, name="Fresh milk", expiration_date=days_from_now(10))
    add(client, name="Eggs", expiration_date=days_from_now(2))

    dashboard = client.get("/api/dashboard").get_json()
    assert dashboard["counts"]["expired"] == 1
    assert dashboard["counts"]["use_soon"] == 1
    assert dashboard["counts"]["fresh"] == 1
    assert [item["name"] for item in dashboard["use_soon"]] == ["Old bread", "Eggs"]

def test_expiry_status_buckets():
    assert expiry_status(None) == "none"
    assert expiry_status(-1) == "expired"
    assert expiry_status(3) == "use_soon"
    assert expiry_status(5) == "this_week"
    assert expiry_status(8) == "fresh"