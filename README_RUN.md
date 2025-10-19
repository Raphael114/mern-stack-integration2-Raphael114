Run instructions (server + client)

Server:

1. cd server
2. copy .env.example to .env and update MONGODB_URI and JWT_SECRET
3. npm install
4. npm run dev

Client:

1. cd client
2. npm install
3. npm run dev

The client is configured to proxy /api to http://localhost:5000 via Vite config.
