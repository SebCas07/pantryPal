# PantryPal

PantryPal is a web app that helps people keep track of the food in their ktichen. Users log grocieries with quantities and expiration dates, see what's about to expire, get recipe ideas that use what they already have, and build a shopping list autmatically. 

## Why PantryPal? 

Most of us have thrown out food we forgot about in the back of the fridge. Waster food is wasted money, especially on a student budget. PantryPal shows what's about to expire so it gets used in time, and it helps you avoid buying things you already have. 

**Built for:** college students, roommates sharing a kitchen, and busy families who want an easy way to manage groceries without a spreadsheet. 

## Planned Features 

- **Pantry inventory:** add, edit, delete, and search items with a quantity, category, and expiration date
- **Expiration dashboard:** color-coded items, a "Use Soon" section, and flags for expired food
- **Recipe suggestions:** recipes from [TheMealDB](https://www.themealdb.com/api.php) that use ingredients already in your pantry, with soon-to-expire items prioritized
- **Shopping list:** built automatically from items that are running low or used up


## Technology Stack (Planned)
 
- **Frontend:** React
- **Backend:** Python, Flask
- **Database:** PostgreSQL
- **External API:** TheMealDB
- **Containerization:** Docker, docker-compose
- **CI/CD:** GitHub Actions
- **Deployment:** Google Cloud Run, Cloud SQL
- **AI Development Tools:** GitHub Copilot

## Getting Started
 
> Setup instructions will be added as the project is built. The planned workflow:
 
1. Clone the repository:
```bash
git clone https://github.com/<your-username>/pantrypal.git
cd pantrypal
```
2. Set up environment variables:
```bash
cp .env.example .env
```
3. Start the app with Docker:
```bash
docker compose up --build
```
4. Open the app at `http://localhost:3000`
## Screenshots
 
_Coming soon._
 
## AI Integration
 
This project is built with GitHub Copilot as the primary coding assistant. Details on how AI tools were used during development will be added here as the project progresses.
 