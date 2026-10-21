# restaurant-app-mvp
## 1. Introduction
1.1 Purpose
This Software Requirements Specification (SRS) defines the functional and non-functional requirements for the
Restaurant App MVP. The application is a frontend-only React Native mobile application designed to demonstrate
restaurant browsing, authentication, cart management, reservations, ordering, order tracking, and manager-side
management features using mock data and local persistence.
1.2 Scope
The system allows customers to create an account or log in, browse restaurant menu items, search and filter food, add
items to a cart, apply promotional codes, reserve tables, place dine-in or takeaway orders, and track order progress.
Managers can view incoming orders, update order status, manage reservations, and add or edit menu items.
The MVP does not use a backend server or external restaurant API. Data is simulated locally and persistent data is
stored using AsyncStorage where required.
1.3 Intended Audience
• Students and instructors evaluating the React Native assignment.
• Restaurant customers using the mobile application.
• Restaurant managers handling orders, reservations, and menu availability.
• Developers maintaining or extending the application.
1.4 Definitions and Acronyms
Term Meaning
MVP Minimum Viable Product
SRS Software Requirements Specification
UI User Interface
CRUD Create, Read, Update, Delete
MVP Customer A restaurant user who browses, reserves, orders, and tracks orders
Manager A restaurant staff user who manages orders, reservations, and menu data
AsyncStorage Local persistent storage used by the React Native application
2. Overall Description
2.1 Product Perspective
The Restaurant App is a standalone mobile frontend. It uses React Native and Expo for the user interface, React
Context for global application state, useReducer for cart and order state, custom hooks for reusable business logic, and
AsyncStorage for local persistence. Mock files provide users, menu items, tables, and reservations.
2.2 User Classes
• Customer: Registers/logs in, browses menu, searches, manages favorites, adds items to cart, applies promotions,
makes reservations, places orders, and tracks orders.
• Manager: Logs in using manager credentials and accesses the manager dashboard to manage orders,
reservations, and menu items.
Restaurant App MVP — SRS | Page 3
• System/Application: Simulates loading, authentication delay, menu fetching, order progression, validation, and local
persistence.
2.3 Operating Environment
• Mobile devices running Android through Expo Go or an Android emulator.
• Development environment: Node.js, npm, Expo CLI, and React Native.
• Source control: Git repository with meaningful commits.
• No backend server or external API is required for the MVP.
2.4 Constraints
• The application must be implemented using React Native.
• No external state-management library such as Redux is permitted.
• The application must demonstrate the required React hooks and custom hooks.
• Restaurant data is mock/local data.
• The application must support light and dark themes.
• The interface must use safe-area handling and responsive mobile layouts.
3. Functional Requirements
FR-01 Authentication
• The system shall provide a single Login/Signup screen.
• The user shall be able to switch between Login and Signup modes.
• Login shall require email and password.
• Signup shall require full name, email, password, confirm password, and role.
• Supported roles shall be Customer and Manager.
• The system shall validate email format and password requirements.
• Password shall contain at least 8 characters and at least one digit.
• Confirm password shall match the password.
• The system shall display field-specific validation errors.
• Errors shall be cleared when the related field is edited.
• The password visibility shall be toggleable.
• Authentication shall simulate a one-second delay and show an ActivityIndicator.
• Successful Customer login shall open the customer interface; Manager login shall open the manager dashboard.
FR-02 Menu Browsing
• The system shall provide at least 15 menu items.
• Menu items shall cover Starters, Mains, Desserts, and Drinks.
• Each item shall contain id, name, description, price, category, image, isSpecial, and isAvailable.
• The application shall simulate menu loading using a delayed Promise.
• A loading indicator and Retry option shall be provided.
Restaurant App MVP — SRS | Page 4
• Users shall be able to filter items by category.
• Unavailable items shall appear visually disabled and their Add button shall be disabled.
• Daily Special items shall display a Daily Special badge.
• The menu shall support pull-to-refresh.
FR-03 Search and Sorting
• Users shall be able to search menu items by name or relevant text.
• The search input shall support focus through useRef.
• The clear button shall empty the search and keep focus.
• Search shall use debouncing to avoid unnecessary filtering.
• The application shall remember the last five search terms.
• Repeated consecutive search terms shall not be duplicated.
• A Back to Top button shall appear after sufficient scrolling.
• Users shall be able to sort by price low-to-high, price high-to-low, or name A-Z.
• An appropriate empty-state message shall be displayed when no items match.
FR-04 Global Authentication and Theme
• Authentication state shall be shared using AuthContext.
• Theme state shall be shared using ThemeContext.
• The application shall provide light and dark color palettes.
• The theme toggle shall update the application immediately.
• Profile shall display user name, email, and role.
• Logout shall clear the current user and return to Login.
• Manager-only functionality shall not be available to Customer users.
FR-05 Cart Management
• Users shall be able to add available menu items to the cart.
• Cart state shall be managed with useReducer.
• The reducer shall support ADD_ITEM, REMOVE_ITEM, INCREMENT, DECREMENT, UPDATE_NOTE,
CLEAR_CART, APPLY_PROMO, and REMOVE_PROMO.
• Users shall be able to increase or decrease quantities.
• An item shall be removed when its quantity reaches zero.
• Users shall be able to add special instructions for individual cart items.
• The cart shall display a live item-count badge.
• The system shall support mock promotional codes such as WELCOME10 and FEAST20.
• Invalid promotional codes shall show an error without corrupting cart state.
FR-06 Order Summary and Checkout
• The system shall calculate subtotal from cart items.
• A 5% service charge shall be calculated.
Restaurant App MVP — SRS | Page 5
• A 15% sales tax shall be calculated.
• A valid promotional discount shall be deducted.
• The grand total shall be displayed clearly.
• Users shall choose Dine-in or Takeaway.
• Dine-in orders shall include a table selection.
• Takeaway orders shall include a pickup time.
• The application shall create an order with an id, items, total, type, status, and timestamp.
• After placing an order, the cart shall be cleared and order tracking shall open.
FR-07 Reservations
• Users shall be able to select a date, hourly time slot, party size, table, and contact details.
• Time slots shall cover 12:00 to 22:00.
• Unavailable slots shall be disabled when no suitable table is free.
• Party size shall be between 1 and 12.
• Pakistani mobile numbers shall follow the 03XX-XXXXXXX format.
• The selected date shall not be in the past.
• Bookings shall be at least one hour ahead of the current time.
• A confirmation modal shall appear before saving a reservation.
• Users shall be able to view their reservations.
• Users shall be able to cancel reservations after confirmation.
FR-08 Order Tracking
• The system shall display order status and progress.
• Initial order status shall be Pending.
• Pending shall progress to Preparing after approximately 10 seconds.
• Preparing shall progress to Ready after approximately 20 seconds.
• Ready shall progress to Served after approximately 30 seconds.
• An elapsed-time counter shall be displayed.
• Intervals shall be cleared when the tracking screen is unmounted.
FR-09 Manager Dashboard
• Only Manager users shall access the Manager Dashboard.
• The dashboard shall contain Incoming Orders, Reservations, and Menu Management sections.
• Managers shall manually update incoming order status.
• Managers shall accept or decline reservations.
• Managers shall add menu items.
• Managers shall edit menu item prices.
• Managers shall toggle menu availability.
• Menu changes shall become visible to customers through shared application state.
Restaurant App MVP — SRS | Page 6
FR-10 Persistence
• Orders shall be persisted using AsyncStorage.
• Reservations shall be persisted using AsyncStorage.
• Menu edits shall be persisted using AsyncStorage.
• Application startup shall load persisted data before showing the main interface.
• The application shall show a loading screen during initial data restoration to avoid displaying incorrect empty data.
4. User Interface Requirements
4.1 Main Screens
• Login / Signup Screen
• Customer Menu Screen
• Cart Screen
• Order Summary Screen
• Reservation Screen
• Order Tracking Screen
• Profile Screen
• Manager Dashboard
4.2 Navigation
The application shall use nested navigation. Customers shall have bottom tabs for Menu, Cart, Reservations, and
Profile. Managers shall have bottom tabs for Dashboard and Profile. Stack navigation shall be used for screens such as
Order Summary and Order Tracking. Navigation shall follow the active user's role.
4.3 Accessibility and Usability
• Buttons and inputs shall have clear labels.
• Disabled controls shall be visually distinguishable.
• Validation messages shall be understandable.
• Loading and error states shall be visible.
• Touch targets shall be appropriate for mobile use.
• Text and controls shall remain readable in both themes.
5. Non-Functional Requirements
5.1 Performance
• Search shall use debouncing.
• Derived menu lists shall use useMemo where appropriate.
• Menu item cards shall use React.memo.
• Event handlers passed to optimized components shall use useCallback where appropriate.
• Large lists shall use FlatList.
Restaurant App MVP — SRS | Page 7
5.2 Reliability
• Timers and intervals shall be cleaned up during component unmount.
• AsyncStorage loading shall handle errors.
• Invalid input shall not create invalid reservations or orders.
• The cart reducer shall be pure and shall not mutate state.
5.3 Maintainability
• Reusable UI shall be placed in components.
• Business logic shall be separated into contexts, reducers, and custom hooks.
• Custom hooks shall begin with use and shall be called at the top level of React components/hooks.
• Theme values shall be centralized in a theme file.
• The codebase shall follow a clear folder structure.
5.4 Security
• This MVP uses mock authentication only and is not intended for production authentication.
• Passwords are stored only in mock/local development data.
• No real payment, banking, or sensitive customer service is implemented.
6. React Hooks and Architecture Requirements
Hook / Feature Required Use
useState Form state, filters, UI toggles, checkout selections, favorites
useEffect Fake fetching, persistence, header updates, timers, cleanup
useRef Input/list references, render counter, previous search query
useContext Authentication, theme, cart, orders, menu, reservations
useReducer Cart and order state management
useMemo Derived filtered/sorted menu data and order totals
useCallback Stable event handlers for optimized components
useForm Reusable login/signup form handling and validation
useDebounce Reusable debounced search
useReservation Reservation state and availability logic
7. Data Requirements
7.1 Mock User Data
The application shall contain mock Customer and Manager accounts for demonstration. Example development
credentials may be provided in the project README.
7.2 Menu Data
Menu data shall include at least 15 records across four categories. Each record shall contain identification, display
information, price, category, image reference, special status, and availability status.
Restaurant App MVP — SRS | Page 8
7.3 Order Data
Each order shall contain a unique id, cart items, total amount, order type, current status, and timestamp.
7.4 Reservation Data
Each reservation shall contain reservation identification, customer information, date, time, party size, table, and status.
8. Error Handling
• Invalid login credentials shall display a clear authentication error.
• Invalid form fields shall show field-level errors.
• Menu loading failure shall provide a Retry action.
• Invalid promotional codes shall show a user-friendly message.
• Unavailable menu items shall not be addable.
• Unavailable reservation slots shall not be selectable.
• AsyncStorage errors shall be handled without crashing the application.
• Unexpected empty search results shall show a friendly empty state.
9. Testing and Acceptance Criteria
• A customer can sign up successfully with valid data.
• A customer can log in and reach the Menu screen.
• A manager can log in and reach the Manager Dashboard.
• At least 15 menu items display correctly.
• Category filtering, search, debounce, sorting, and pull-to-refresh work.
• Items can be added, removed, incremented, decremented, and annotated in the cart.
• Valid and invalid promo codes behave correctly.
• Order totals calculate service charge, tax, and discount correctly.
• A customer can create and cancel a valid reservation.
• Unavailable reservation times cannot be selected.
• An order progresses through its tracking statuses.
• A manager can update orders, reservations, and menu availability.
• Theme switching updates all screens.
• Persisted orders, reservations, and menu changes are restored after restarting the app.
10. Project Structure
Restaurant-app/
nnn App.js
nnn src/components/
nnn src/screens/
nnn src/context/
nnn src/reducers/
nnn src/hooks/
Restaurant App MVP — SRS | Page 9
nnn src/data/
nnn src/navigation/
nnn src/theme.js
11. Technology Stack
• React Native
• Expo
• JavaScript
• React Navigation
• AsyncStorage
• React Context API
• React Hooks
• FlatList for list rendering
• Git/GitHub for version control
12. Future Enhancements
• Real backend authentication and database.
• Online payment integration.
• Real restaurant location and map integration.
• Push notifications for order status.
• Real-time order updates.
• Customer reviews and ratings.
• Multiple restaurants and branch selection.
• Production-level security and encrypted authentication.
13. Conclusion
The Restaurant App MVP provides a complete frontend demonstration of a modern restaurant ordering workflow. It
combines authentication, menu browsing, search, cart management, promotions, reservations, checkout, order
tracking, manager controls, local persistence, theming, and reusable React hooks. 
