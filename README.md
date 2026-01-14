# 🎬 BookMyShow: End-to-End Cinema Management & Booking System

A robust, enterprise-grade movie ticket booking platform engineered with a microservices-based architecture. This system manages the complete lifecycle of movie discovery, theatre operations, real-time seat orchestration, and secure payment processing.

## 🏗️ System Architecture

The project is built on a high-availability backend architecture that leverages multiple technologies for performance and consistency:

- **GraphQL Gateway**: A centralized API entry point that orchestrates requests to various internal microservices.
- **Microservices Layer**: Distributed services (Theatre, Movie, Booking, Payment, User) communicating via **gRPC** for low-latency inter-service calls.
- **In-Memory Orchestration**: **Redis** is utilized for real-time seat locking, caching show dates, and managing concurrent user sessions to prevent double-bookings.
- **Persistence**: **MongoDB** serves as the primary data store for movie metadata, theatre layouts, and booking history.
- **Assets**: CDN-backed asset management for high-performance delivery of movie banners and visuals.

## ⚙️ Core Backend Services

### 📡 Gateway & Inter-Service
- **GraphQL API**: Handles complex nested queries and mutations for both cinema-goers and theatre administrators.
- **gRPC Infrastructure**: Ensures type-safe, high-speed communication between the Theatre service and the Gateway.

### 🎥 Cinema & Content Management
- **Movie Service**: Manages movie lifecycles, metadata (genres, certification, cast), and multi-language support.
- **Theatre Service**: Handles theatre registrations, screen configurations, and seat layout definitions.
- **Show Service**: Orchestrates batch show creation, timing management, and dynamic pricing models per category.

### 🎟️ Booking & Real-Time Orchestration
- **Concurrent Booking Engine**: Leverages Redis atomic operations to manage seat availability and perform millisecond-latency locks.
- **Seat Availability Mapping**: Provides real-time visual feedback on seat statuses (Available, Locked, Booked).
- **Graceful Releases**: Automatically handles TTL-based seat releases if payments are not completed.

### 💳 Transactional Services
- **Payment Service**: Securely manages transaction sessions, processing webhooks from payment service providers (PSPs) and updating booking states upon success.
- **User Service**: Manages secure authentication for registered users and guest checkout flows.

## 🔄 Technical Flow

The system follows a strict operational path to ensure data integrity:
1. **Discovery**: GraphQL fetches movies and filtered shows using proximity-based location logic.
2. **Locking**: Upon seat selection, the **Booking Service** creates a temporary lock in Redis.
3. **Validation**: The **Payment Service** initiates a session; successful webhooks trigger a gRPC call to confirm the booking in the persistent database.
4. **Notification**: Post-confirmation, the service triggers notification protocols (Email/SMS) for the end-user.

## 🚀 Environment Setup

### Prerequisites
- Node.js 18+
- Go/Python/Node (Backend Services)
- Redis Server
- MongoDB Instance

### Quick Start (Frontend)
```bash
npm install
npm run dev
```

---
*Note: This repository contains the professional frontend interface and coordination logic for the overall BookMyShow architecture.*
