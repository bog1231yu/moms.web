# Project Overview

## Architecture
- Static Webflow-exported frontend in the project root (`index.html`, `company.html`, `order.html`, `login.html`, `css/`, `js/`, `images/`).
- Node.js/Express backend in `backend/` serves the root static site and `/api/*` endpoints.
- Backend data is stored in JSON files under `backend/data/`; no external database is required for the current setup.

## Replit Setup
- Main workflow runs `cd backend && npm start` on port 5000.
- Express listens on `0.0.0.0` and trusts the Replit proxy for preview compatibility.
- Production deployment is configured to run the same backend server command.

## Important Notes
- Run backend commands from the `backend/` directory so static files resolve correctly.
- The frontend API helper uses relative same-origin `/api` URLs when served over HTTP.
- User preference: never change the site's colors unless explicitly requested; only change objects/content/layout.
- Login/register uses `/api/auth/*`, bcrypt-hashed passwords, JWT tokens in browser local storage, and file-based users in `backend/data/users.json`.