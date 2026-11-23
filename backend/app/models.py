""" Database models."""
from datetime import date, datetime, timezone

from flask_sqlalchemy import SQLAlchemy 

db = SQLAlchemy

CATEGORIES = [ "produce", "dairy", "meat", "grains", "canned", "frozen", "snacks", "drinks", "other"]

#in short: grabs the integer within 'days_left' to go through if-statements that returns the how old/fresh the item is 
def expiry_status(days_left, use_soon_days = 3 ): 
    """Bucekt an item by days until it expires.
   
    expired -> past its date
    use_soon -> within use_soon_days (default 3) 
    this_week -> within 7 days
    fresh -> more than 7 days
    none -> no expiration date recorded
    """
    if days_left is None: 
        return "none"
    if days_left < 0: 
        return "expired"
    if days_left <= use_soon_days: 
        return "use_soon"
    if days_left <= 7: 
        return "this_week"
    return "fresh"

class Item(db.Model): 
    __tablename__ = "items"

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(120), nullable=False)
    quantity = db.Column(db.Float, nullable = False, default=1) 
    unit = db.Column(db.String(30), nullable=True)
    category = db.Column(db.String(30), nullable = False, default = "other") 
    expiration_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default = lambda: datetime.now(timezone.utc))

    #in short: get expiration date and subtract it by the day this is ran to get expiration date
    def days_until_expiry(self, today=None): 
        if self.expiration_date is None: 
            return None
        today = today or date.today()
        return (self.expiration_date - today).days

    def to_dict(self, use_soon_days = 3): 
        days_left = self.days_until_expiry()
        return { 
            "id": self.id, 
            "name": self.name, 
            "quantity": self.quantity, 
            "unit": self.unit, 
            "category": self.category,
            "expiration_date": 
                self.expiration_date.isoformat() 
                if self.expiration_date else None, 
            "days_until_expiry": days_left, 
            "status": expiry_status(days_left, use_soon_days) 
        

        }