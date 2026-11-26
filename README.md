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

## Project Status

**Current sprint:** Sprint 1 (MVP): pantry inventory, expiration tracking, and a first deployment.

| Area | Jira | Story | Status | 
|---|---|---|---| 
| Inventory | PAN-4 | Add an item | ☐ |  
| Inventory | PAN-5 | Edit an item | ☐ | 
| Inventory | PAN-6 | Delete an item | ☐ |
| Inventory | PAN-7 | Search and filter items | ☐ |  
| Inventory | PAN-11 | Sort items by expuiration date | ☐ |  
| Expiry | PAN-8 | Color-code items by expiration status | ☐ | 
| Expiry | PAN-9 | "Use soon" list | ☐ | 
| Expiry | PAN-10 | Flag expired items | ☐ | 
| Infastructure | PAN-19 | Run the stack with docker-compose | ☐ |
| Infastructure | PAN-21 | Deploy to Cloud Run + Cloud SQL (first attempt) | ☐ |     

**Expiration rules:** expired (past date), use soon(3 days or less, set by 'USE_SOON_DAYS'), this week (7 days or less), fresh or no date.

**Coming next:**
-**Sprint 2:** recipe suggestions and the shopping list (PAN-12 to PAN-18)
-**Sprint 3:** Github Actions CI/CD (PAN-20) and secrets management (PAN-22)





## Technology Stack (Planned)
 
- **Frontend:** React
- **Backend:** Python, Flask
- **Database:** PostgreSQL
- **External API:** TheMealDB
- **Containerization:** Docker, docker-compose
- **CI/CD:** GitHub Actions
- **Deployment:** Google Cloud Run, Cloud SQL
- **AI Development Tools:** GitHub Copilot

## Running with Docker

### Start the app

Install Docker Desktop with Docker Compose, then run these commands from the repository root:

```bash
docker compose up --build
```

Open the website at [http://localhost:3000](http://localhost:3000). The API health check is available at [http://localhost:5000/api/health](http://localhost:5000/api/health).

Press `Ctrl+C` in the Compose terminal to stop the services. Run `docker compose up` to start them again.

### Docker notes

- The frontend container serves the built React app with Nginx and forwards `/api` requests to the backend container.
- The backend connects to the `db` Postgres service; Postgres data is kept in the named `postgres_data` volume across restarts.
- `docker compose down` keeps the database volume. Avoid `docker compose down --volumes` if you want to keep your pantry data.
- Tested on Windows with Docker Desktop.

## Screenshots
 
_Coming soon._
 
## AI Integration
 
This project is built with GitHub Copilot as the primary coding assistant. Details on how AI tools were used during development will be added here as the project progresses.
 