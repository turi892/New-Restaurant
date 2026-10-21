# SRS_v2 – Restaurant App with Server and Database

## 1. Scope (Section 1.2)

The system will include a mobile restaurant application and a backend server connected to a database. The server will store and sync shared data for users, menu items, reservations, and orders so that every connected device sees the same information.

The following problems were identified during manual testing of the A1 version:

- Customer orders were saved only on one phone and did not appear on other devices.
- Manager menu changes were local to one device and not shared across app instances.
- Reservation and user data disappeared after reinstalling the app.
- Menu availability was not updated globally when a dish ran out.

These issues will be solved by saving app data in a server-backed database and by fetching the latest data from the backend whenever the app loads or updates.

Real payments and push notifications remain out of scope.

## 2. Definitions (Section 1.3)

- API: A defined communication contract that allows applications to request and send data.
- REST: A style of web service design using HTTP methods and resources.
- Endpoint: A URL route used to access a specific server feature.
- JSON: A lightweight data format used to send structured information between client and server.
- MongoDB: A NoSQL database used to store app data.
- Collection: A MongoDB table that stores documents of the same type.
- Mongoose: A Node.js library used to define schemas and interact with MongoDB.
- Middleware: Code that runs during request processing before the final route handler.
- JWT: A token used to verify a user’s identity in authenticated requests.
- HTTP Status Code: A number returned by the server to indicate the result of a request.

## 3. Database Design (Section 5)

| Collection | Fields and Types | Relationships and Rules |
| --- | --- | --- |
| Users | id: string, name: string, email: string, password: string, role: "customer" \| "manager", phone: string | Email is unique. Password is stored securely in production, and each order is linked to a user ID when available. |
| MenuItems | id: string, name: string, description: string, price: number, category: string, image: string, isSpecial: boolean, isAvailable: boolean | Menu items are public and shared across all devices. A manager can toggle availability so customers immediately see whether an item is sold out. |
| Tables | id: string, tableNumber: number, capacity: number, status: "available" \| "occupied" | Each table is a physical restaurant table. Reservations reference its table number and the server checks capacity and time-slot conflicts. |
| Reservations | id: string, customerName: string, date: string, time: string, guests: number, phone: string, tableNumber: number, userId: string, status: string | Linked to the customer ID and a restaurant table number. The server prevents a table being reserved twice for the same date and time. |
| Orders | id: string, userId: string, items: array, total: number, type: string, tableNumber: string, pickupTime: string, status: string, timestamp: number | Each order belongs to the user who created it and stores the order items and current status. This supports cross-device tracking. |

## 4. API Endpoints (Section 8)

| Method | Endpoint | Access | Request Body | Response |
| --- | --- | --- | --- | --- |
| POST | /api/auth/login | Public | email, password | token and user |
| GET | /api/menu | Public | None | List of menu items |
| PATCH | /api/menu/:id/availability | Manager | isAvailable | Updated menu item |
| GET | /api/orders | Public | None | List of orders |
| POST | /api/orders | Customer | items, total, type, tableNumber, pickupTime | Created order |
| PATCH | /api/orders/:id/status | Manager | status | Updated order status |
| GET | /api/reservations | Customer/Manager | Optional userId query | Customer's or all reservations |
| POST | /api/reservations | Customer | customerName, date, time, guests, phone, tableNumber, userId | Created reservation |
| PATCH | /api/reservations/:id/status | Customer/Manager | status | Updated reservation status |
| GET | /api/users | Manager | None | List of users |
| POST | /api/auth/signup | Public | name, email, password, role, phone | token and user |
| GET | /api/health | Public | None | Server status |
| GET | /api/tables | Public | Optional date and time query | Tables and time-slot availability |
| PATCH | /api/tables/:id/status | Manager | status | Updated table status |
| POST | /api/menu | Manager | name, description, price, category, image | Created menu item |

## Summary

This version of the app moves away from mock-only local state and uses a shared backend + database to solve the real synchronization issues described in the original assignment.
