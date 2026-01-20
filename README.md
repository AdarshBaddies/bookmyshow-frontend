# Movie & Event Booking Platform – Frontend

**Backend services:** [https://github.com/movie-event-booking](https://github.com/movie-event-booking)

A production-grade frontend application for a high-concurrency movie and event booking system, inspired by BookMyShow-scale architectures. This repository focuses on the **user and admin-facing interfaces** and acts as the primary entry point into a distributed backend composed of multiple Go microservices.

This frontend communicates exclusively through a **GraphQL API Gateway**, which orchestrates requests across backend services using gRPC and event-driven workflows.

---

## System Overview

The platform supports the complete booking lifecycle:

* Movie discovery based on user location
* Theatre, screen, and show management via admin workflows
* Real-time seat availability and concurrent booking protection
* Asynchronous booking finalization through backend events



---

## Architecture Highlights

* **GraphQL API Gateway**
  Single entry point for all client interactions, aggregating data from multiple backend services and minimizing over-fetching.

* **High-Concurrency Booking Flow**
  Seat selection reflects real-time availability backed by Redis-based atomic seat locking in the Booking Service.

* **Event-Driven Backend Coordination**
  Booking confirmations and downstream actions are processed asynchronously via Kafka, keeping the UI responsive under load.

* **Role-Based Interfaces**

  * User portal for discovery, seat selection, and booking
  * Admin portals for movie, theatre, screen layout, and show management

---

## Backend Services (External)

This frontend integrates with the following backend services hosted under a dedicated GitHub organization:

* Movie Service
* Theatre Service
* Screen Service
* Show Service
* Booking Service
* Payment Service

Backend repositories: [https://github.com/movie-event-booking](https://github.com/movie-event-booking)

---

## System Flow Overview

The platform is composed of multiple domain-focused services coordinated via GraphQL, gRPC, Redis, and Kafka.

```mermaid
graph TD
    %% Entry
    UI[User / Admin UI] --> GQL[GraphQL Gateway]

    %% Admin & Content Management
    GQL -->|mutations| MovieSvc[Movie Service]
    GQL -->|mutations| TheatreSvc[Theatre Service]
    GQL -->|mutations| ScreenSvc[Screen Service]
    GQL -->|mutations| ShowSvc[Show Service]

    MovieSvc --> Mongo[(MongoDB)]
    MovieSvc --> RedisUser[(Redis - User Cache)]

    TheatreSvc --> PG[(Postgres)]
    ScreenSvc --> PG
    ShowSvc --> PG
    ShowSvc --> RedisUser

    %% User Access
    GQL --> UserSvc[User Service]
    GQL --> Guest[Guest Access]
    UserSvc --> PG

    %% Booking Flow
    GQL -->|start booking| BookingSvc[Booking Service]
    BookingSvc --> RedisLock[(Redis - Seat Locks)]
    BookingSvc --> BookingDB[(Booking Data Store)]

    %% Events
    BookingSvc --> KafkaBooking[(Kafka - Booking Events)]

    %% Payment Flow
    BookingSvc --> PaymentSvc[Payment Service]
    PaymentSvc --> KafkaPayment[(Kafka - Payment Events)]
    PSP[PSP] -->|webhook| PaymentSvc

    %% Finalization
    KafkaBooking --> Notify[Notification Service]
    Notify --> Mail[Email / SMS]
```

---


## Technical Flow

The system follows a strict operational path:
1. **Discovery**: GraphQL fetches movies and filtered shows using location proximity.
2. **Locking**: Upon seat selection, the Booking Service creates an atomic lock in Redis.
3. **Transaction**: The Payment Service processes webhooks; successful transactions trigger a gRPC call to confirm the booking in PostgreSQL.
4. **Dispatch**: Confirmed bookings are emitted via Kafka for asynchronous notification and finalization.


## Visual Overview

### User Experience

The user portal prioritizes ease of use with proximity-based movie discovery and a seamless booking flow.

![Landing Page](screenshots/user/landing_page.png)
*Proximity-based movie discovery*

![Location Selection](screenshots/user/location_pop_up.png)
*Regional content filtering*

![Movie Details](screenshots/user/movie_page.png)
*Movie details and metadata*

![Show Selection](screenshots/user/shows_page.png)
*Real-time show availability across theatres*

![Seat Selection](screenshots/user/seat_layout_page.png)
*Live seat mapping with concurrent locking feedback*

### Administrative Control

The admin interfaces provide granular control over the cinema ecosystem with a focus on operational correctness and flexibility.

#### Screen Layout System

Admins can visually design complex screen layouts, define seat categories, and handle irregular seating arrangements. Generated seat identifiers are synced with backend Booking and Display services.

![Theatre Admin](screenshots/admin/theatre-admin.png)
*Screen layout and theatre management*

![Movie Admin](screenshots/admin/movie-admin.png)
*Movie lifecycle and metadata control*

![Location Management](screenshots/admin/location-admin.png)
*Proximity and regional configuration*

---

## Design Principles

* Clear separation between frontend and backend ownership
* No direct service-to-service coupling from the client
* Optimized for high read traffic and bursty booking events
* Built to resemble real-world, production deployment patterns

---

*This repository contains the frontend application only. Backend logic, data stores, and event pipelines are maintained independently in the backend organization.*
