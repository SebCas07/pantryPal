from datetime import date, timedelta

from app.models import expiry_status


def days_from_now(n):
    return (date.today() + timedelta(days=n)).isoformat()


def add(client, **fields):
    payload = {"name": "Milk", "quantity": 1, "category": "dairy"}
    payload.update(fields)
    return client.post("/api/items", json=payload)


def test_create_and_list_item(client):
    res = add(client, expiration_date=days_from_now(2))


def test_create_requires_name(client):
    res = client.post("/api/items", json={"quantity": 1})
    assert res.status_code == 400
    assert "name" in res.get_json()["errors"]


def test_rejects_bad_date_and_category(client):
    res = add(client, expiration_date="next tuesday", category="toys")
    assert res.status_code == 400
    errors = res.get_json()["errors"]
    assert "expiration_date" in errors
    assert "category" in errors


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
    add(client, name="Rice")
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


def test_search_by_name_is_case_insensitive(client):
    add(client, name="Whole Milk")
    add(client, name="Oat milk")
    add(client, name="Eggs")
    names = {item["name"] for item in client.get("/api/items?q=MILK").get_json()}
    assert names == {"Whole Milk", "Oat milk"}


def test_filter_by_category(client):
    add(client, name="Milk", category="dairy")
    add(client, name="Apples", category="produce")
    items = client.get("/api/items?category=produce").get_json()
    assert [item["name"] for item in items] == ["Apples"]


def test_filter_unknown_category_is_rejected(client):
    assert client.get("/api/items?category=toys").status_code == 400


def test_filter_by_status_and_combined(client):
    add(client, name="Spinach", category="produce", expiration_date=days_from_now(1))
    add(client, name="Carrots", category="produce", expiration_date=days_from_now(20))
    add(client, name="Yogurt", category="dairy", expiration_date=days_from_now(1))
    items = client.get("/api/items?status=use_soon&category=produce").get_json()
    assert [item["name"] for item in items] == ["Spinach"]