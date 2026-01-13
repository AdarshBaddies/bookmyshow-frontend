# 🎬 BookMyShow Frontend

A modern, premium movie ticket booking platform inspired by BookMyShow, built with React, TypeScript, and GraphQL.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Your GraphQL backend running on `http://localhost:8080`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

## 📁 Project Structure

```
frontend/
├── src/
│   ├── graphql/          # Apollo Client & GraphQL queries/mutations
│   ├── pages/            # Page components
│   │   ├── Home.tsx           # Landing page
│   │   └── TestEndpoint.tsx   # GraphQL endpoint tester
│   ├── styles/           # Global CSS & design system
│   ├── App.tsx           # Root component with routing
│   └── main.tsx          # Entry point
├── package.json
├── vite.config.ts        # Vite configuration
└── tsconfig.json         # TypeScript configuration
```

## 🧪 Testing Your Backend

1. Start your GraphQL server on port 8080
2. Run the frontend: `npm run dev`
3. Open browser: http://localhost:5173
4. Click **"Test GraphQL Endpoint"**
5. Test the following queries:
   - **getShowDates**: Get available dates for a movie
   - **getShows**: Get shows by location and date

### Sample Test Data

Use these values in the endpoint tester:

- **Location ID**: `MUM1`
- **Movie ID**: `MV001_MOVIE`
- **Longitude**: `72.8424`
- **Latitude**: `19.1197`
- **Radius**: `10` km
- **Date**: `20251122` (YYYYMMDD format)

## 🎨 Design System

The app uses a BookMyShow-inspired dark theme with:
- **Primary Color**: `#f84464` (Red)
- **Secondary Color**: `#00d9ff` (Cyan)
- **Background**: `#0f1014` (Dark)
- **Font**: Inter (body), Poppins (headings)

All design tokens are defined in `src/styles/index.css` as CSS variables.

## 🔌 GraphQL Integration

### Endpoint Configuration
- **URL**: `http://localhost:8080/graphql`
- **Client**: Apollo Client
- **Config**: `src/graphql/client.ts`

### Available Queries
Located in `src/graphql/queries.ts`:
- `GET_SHOW_DATES` - Get available dates
- `GET_SHOWS` - Get shows by location
- `GET_SCREEN` - Get screen layout
- `GET_SEATS` - Get real-time seat availability
- `GET_BOOKING_DETAILS` - Get booking info

### Available Mutations
Located in `src/graphql/mutations.ts`:
- `LOCK_SEATS` - Lock seats for booking
- `RELEASE_SEATS` - Release locked seats
- `MAKE_PAYMENT` - Process payment

## 🔧 Configuration

### Vite Config (`vite.config.ts`)
- **Dev Server Port**: 5173
- **GraphQL Proxy**: Proxies `/graphql` to `http://localhost:8080`
- **Path Alias**: `@/` maps to `src/`

### TypeScript Config
- **Strict Mode**: Enabled
- **Target**: ES2020
- **JSX**: react-jsx

## 🐛 Troubleshooting

### "Network error" when testing endpoint
- Make sure your GraphQL server is running on port 8080
- Check console for CORS errors
- Verify your backend is accessible at `http://localhost:8080/graphql`

### Port 5173 already in use
```bash
# Kill the process or change port in vite.config.ts
```

### Cannot find module errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Next Steps

After verifying the endpoint works:
1. ✅ Test GraphQL connection
2. 🚧 Build show selection page
3. 🚧 Build seat selection page
4. 🚧 Implement payment flow
5. 🚧 Add admin portal

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **GraphQL Client**: Apollo Client
- **Routing**: React Router v6
- **State Management**: Zustand (planned)
- **Styling**: Vanilla CSS with CSS Variables

## 📄 License

This project is part of the BookMyShow-inspired booking system.

---

**Note**: Make sure your backend microservices (Theatre, Show, Booking, Payment) are running before testing the complete booking flow.
