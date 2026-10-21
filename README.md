# New-Restaurant

A React Native and Expo restaurant app MVP for browsing menus, managing a cart, placing orders, reserving tables, tracking orders, and manager-side restaurant operations.

## Project Overview

This project is a frontend-only mobile application built with React Native and Expo. It uses mock data, React Context, reducers, custom hooks, and AsyncStorage for local persistence. It does not currently require a backend server or external restaurant API.

## Features

### Customer
- Sign up and log in with field validation.
- Browse menu items across Starters, Mains, Desserts, and Drinks.
- Search, filter, and sort menu items.
- Add items to the cart, change quantities, and add special instructions.
- Apply promotional codes such as `WELCOME10` and `FEAST20`.
- Place dine-in or takeaway orders.
- Reserve tables and view or cancel reservations.
- Track order progress.
- View profile details and switch between light and dark themes.

### Manager
- Access the manager dashboard.
- View incoming orders and update order statuses.
- Accept or decline reservations.
- Add menu items, edit prices, and toggle availability.

### Persistence
- Orders, reservations, and menu edits are saved locally with AsyncStorage.
- Persisted data is restored when the app starts.

## Technology Stack

- React Native
- Expo
- JavaScript
- React Navigation
- React Context API
- React Hooks and `useReducer`
- AsyncStorage
- `FlatList`
- Git and GitHub

## Main Screens

- Login / Signup
- Customer Menu
- Cart
- Order Summary / Checkout
- Reservation
- Order Tracking
- Profile
- Manager Dashboard

## Project Structure

```text
Restaurant-app/
├── App.js
└── src/
    ├── components/
    ├── screens/
    ├── context/
    ├── reducers/
    ├── hooks/
    ├── data/
    ├── navigation/
    └── theme.js
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the Expo development server

```bash
npx expo start
```

Then open the project using Expo Go or an Android emulator.

## Development Notes

- This MVP uses mock authentication and local data; it is not production-ready authentication.
- No real payment processing or external restaurant API is included.
- Manager-only screens and actions should be restricted to Manager users.
- The app should support both light and dark themes.

## Assignment Acceptance Checklist

- [ ] Customer signup and login work.
- [ ] Manager login opens the manager dashboard.
- [ ] Menu browsing, search, filtering, sorting, and refresh work.
- [ ] Cart quantities, item notes, and promotional codes work.
- [ ] Checkout totals include service charge, sales tax, and valid discounts.
- [ ] Customers can create and cancel reservations.
- [ ] Order tracking displays status progress.
- [ ] Managers can update orders, reservations, and menu items.
- [ ] Theme switching updates the interface.
- [ ] Orders, reservations, and menu edits persist after restarting the app.
