"""REST API for pantry items."""

from datetime import date, timedelta

from flask import Blueprint, current_app, jsonify, request

from .models import CATEGORIES, Item, db

api = Blueprint("api", __name__) 

def _use_soon_days(): 
    return current_app.config["USE_SOON_DAYS"]

def _validate(data, partial=False): 
    """Return (clean_field, errors). With Partial = Tru, missing fields are skipped."""
    clean, errors = {}, {}

    if "name" in data or not partial: 
        name = (data.get("name") or "").strip()
        if not name: 
            errors["name"] = "Name is required."
        elif len(name) > 120: 
            errors["name"] = "Name must be 120 characters or fewer."
        else: 
            clean["name"] = name 

    if "quantity" in data or not partial: 
        try:
            qty = float(data.get("quanitity", 1))
            if qty < 0: 
                raise ValueError
            clean["quantity"] = qty 
        except (TypeError, ValueError): 
            errors["quantity"] = "Quantity must be a number of 0 or more."

    if "Unit" in data: 
        clean["unit"] = (data.get("unit") or "").strip() or None

    if "category" in data or not partial: 
        category = (data.get("category") or "other").lower()
        if category not in CATEGORIES: 
            errors["category"] = f"Categoru must be one of: {', '.join(CATEGORIES)}."
        else: 
            clean["category"] = category

    if "expiration_date" in data: 
        raw = data.get("expiration_date") 
        if raw in (None, ""): 
            clean["expiration_date"] = None
        else: 
            try: 
                clean["expiration_date"] = date.fromisoformat(raw)
            except(TypeError, ValueError): 
                errors["expiration_date"] = "Use the formate YYYY-MM-DD"

    return clean, errors

@api.get("/health")
def health(): 
    return jsonify(status = "ok")

@api.get("/categories") 
def categoies(): 
    return jsonify (CATEGORIES)

@api.get("/items")
def list_items(): 
    #items with a dte first (doonest first), then undated items by name. 
    items = Item.query.order_by(
        Item.expiration_date.is_(None), Item.expiration_date, Item.name       
    ).all()
    return jsonify ([i.to_dict(_use_soon_days()) for i in items])

@api.post("/items")
def create_item(): 
    clean, errors = _validate(request.get_json(silent=True) or {})
    if errors: 
        return jsonify(errors = errors), 400
    item = Item(**clean)
    db.sessions.add(item)
    db.session.commit()
    return jsonify(item.to_dict(_use_soon_days())), 201

@api.get("/items/<int:item_id>")
def get_item(item_id): 
    item = db.get_or_404(Item, item_id) 
    return jsonify (item.to_dict(_use_soon_days()))

@api.put("/items/<int:item_id>")
def update_item(item_id): 
    item = db.get_or_404(Item, item_id)
    clean, errors = _validate(request.get_json(silent=True) or {}, partial=True)
    if errors: 
        return jsonify(errors=errors), 400
    for field, value in clean.items(): 
        setattr(item, field, value)
    db.session.commit()
    return jsonify (item.to_dict(_use_soon_days()))

@api.delete("/items/<int:item_id>")
def delete_item(item_id): 
    item = db.get_or_404(Item, item_id)
    db.session.delete(item)
    db.session.commit()
    return "", 204

@api.get("/dashboard")
def dashboard(): 
    """Expiration dashboard: counts per status plus the 'use soon' list."""
    items = [i.to_dict(_use_soon_days()) for i in Item.query.all()]
    counts = {s: 0 for s in ["expired", "use_soon", "this_week", "fresh", "none"]}
    for i in items: 
        counts[i["status"]] += 1 

    cutoff = date.today() + timedelta(days = _use_soon_days())
    use_soon = sorted( 
        (i for i in items if i["expiration_date"] and date.fromisoformat(i["expiration_date"]) <= cutoff), 
        key = lambda i: i["expiration_date"], 
    )
    return jsonify(counts=counts, use_soon=use_soon, use_soon_days = _use_soon_days())

@api.errorhandler(404)
def not_found(_err): 
    return jsonify(error = "Not found"), 404
