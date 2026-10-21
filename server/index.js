const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/restaurant-app";

const defaultUsers = [
  {
    name: "Ali Khan",
    email: "customer@gmail.com",
    password: "12345678",
    role: "customer",
    phone: "0300-1234567",
  },
  {
    name: "Restaurant Manager",
    email: "manager@gmail.com",
    password: "12345678",
    role: "manager",
    phone: "0300-7654321",
  },
];

const defaultMenu = [
  {
    name: "Chicken Wings",
    description: "Crispy chicken wings with special sauce.",
    price: 550,
    category: "Starters",
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2",
    isSpecial: true,
    isAvailable: true,
  },
  {
    name: "Nuggets Chicken",
    description: "Crispy golden chicken nuggets.",
    price: 450,
    category: "Starters",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710",
    isSpecial: false,
    isAvailable: true,
  },
  {
    name: "Garlic Bread",
    description: "Fresh garlic bread with cheese.",
    price: 300,
    category: "Starters",
    image: "https://images.unsplash.com/photo-1573140401552-3fab0b24306f",
    isSpecial: false,
    isAvailable: true,
  },
  {
    name: "Chicken Burger",
    description: "Juicy chicken burger with fresh vegetables.",
    price: 450,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    isSpecial: true,
    isAvailable: true,
  },
  {
    name: "Chicken Pizza",
    description: "Cheesy chicken pizza with special toppings.",
    price: 900,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    isSpecial: true,
    isAvailable: true,
  },
  {
    name: "Chicken Pasta",
    description: "Creamy pasta with grilled chicken.",
    price: 650,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb",
    isSpecial: false,
    isAvailable: true,
  },
  {
    name: "Beef Steak",
    description: "Tender beef steak with vegetables.",
    price: 1200,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d",
    isSpecial: false,
    isAvailable: true,
  },
  {
    name: "Chicken Sandwich",
    description: "Fresh chicken sandwich with vegetables.",
    price: 400,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af",
    isSpecial: false,
    isAvailable: true,
  },
  {
    name: "Chocolate Cake",
    description: "Soft chocolate cake with cream.",
    price: 350,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    isSpecial: true,
    isAvailable: true,
  },
  {
    name: "Ice Cream",
    description: "Cold and creamy vanilla ice cream.",
    price: 250,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
    isSpecial: false,
    isAvailable: true,
  },
  {
    name: "Brownie",
    description: "Warm chocolate brownie.",
    price: 300,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e",
    isSpecial: false,
    isAvailable: true,
  },
  {
    name: "Fresh Juice",
    description: "Fresh seasonal fruit juice.",
    price: 220,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba",
    isSpecial: false,
    isAvailable: true,
  },
  {
    name: "Cold Drink",
    description: "Chilled soft drink.",
    price: 120,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e",
    isSpecial: false,
    isAvailable: true,
  },
  {
    name: "Milkshake",
    description: "Creamy chocolate milkshake.",
    price: 350,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699",
    isSpecial: true,
    isAvailable: true,
  },
  {
    name: "Coffee",
    description: "Hot fresh coffee.",
    price: 200,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
    isSpecial: false,
    isAvailable: true,
  },
];

const defaultTables = [
  { tableNumber: 1, capacity: 2, status: "available" },
  { tableNumber: 2, capacity: 2, status: "available" },
  { tableNumber: 3, capacity: 4, status: "available" },
  { tableNumber: 4, capacity: 4, status: "available" },
  { tableNumber: 5, capacity: 6, status: "available" },
  { tableNumber: 6, capacity: 8, status: "available" },
  { tableNumber: 7, capacity: 10, status: "available" },
  { tableNumber: 8, capacity: 12, status: "available" },
];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "manager"], default: "customer" },
    phone: { type: String, default: "" },
  },
  { timestamps: true }
);

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, default: "" },
    isSpecial: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        category: { type: String },
      },
    ],
    total: { type: Number, required: true },
    type: { type: String, enum: ["Dine-in", "Takeaway"], default: "Takeaway" },
    tableNumber: { type: String, default: null },
    pickupTime: { type: String, default: null },
    status: { type: String, default: "Pending" },
    userId: { type: String, default: null },
    timestamp: { type: Number, default: Date.now },
  },
  { timestamps: true }
);

const reservationSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    phone: { type: String, default: "" },
    tableNumber: { type: Number, required: true },
    userId: { type: String, default: null },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

const tableSchema = new mongoose.Schema(
  {
    tableNumber: { type: Number, required: true, unique: true },
    capacity: { type: Number, required: true, default: 4 },
    status: { type: String, enum: ["available", "occupied"], default: "available" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
const MenuItem = mongoose.models.MenuItem || mongoose.model("MenuItem", menuItemSchema);
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
const Reservation = mongoose.models.Reservation || mongoose.model("Reservation", reservationSchema);
const Table = mongoose.models.Table || mongoose.model("Table", tableSchema);

let dbConnected = false;

const serializeUser = (user) => {
  if (!user) return null;
  const plain = user.toObject ? user.toObject() : user;
  const { _id, __v, password, ...rest } = plain;
  return {
    ...rest,
    id: _id ? _id.toString() : rest.id,
  };
};

const serializeMenuItem = (item) => {
  if (!item) return null;
  const plain = item.toObject ? item.toObject() : item;
  const { _id, __v, ...rest } = plain;
  return {
    ...rest,
    id: _id ? _id.toString() : rest.id,
  };
};

const serializeOrder = (order) => {
  if (!order) return null;
  const plain = order.toObject ? order.toObject() : order;
  const { _id, __v, ...rest } = plain;
  return {
    ...rest,
    id: _id ? _id.toString() : rest.id,
  };
};

const serializeReservation = (reservation) => {
  if (!reservation) return null;
  const plain = reservation.toObject ? reservation.toObject() : reservation;
  const { _id, __v, ...rest } = plain;
  return {
    ...rest,
    id: _id ? _id.toString() : rest.id,
  };
};

const serializeTable = (table) => {
  if (!table) return null;
  const plain = table.toObject ? table.toObject() : table;
  const { _id, __v, ...rest } = plain;
  return {
    ...rest,
    id: _id ? _id.toString() : rest.id,
  };
};

async function seedDatabase() {
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    await User.insertMany(defaultUsers);
  }

  const menuCount = await MenuItem.countDocuments();
  if (menuCount === 0) {
    await MenuItem.insertMany(defaultMenu);
  }

  await Table.bulkWrite(
    defaultTables.map((table) => ({
      updateOne: {
        filter: { tableNumber: table.tableNumber },
        update: {
          $set: { capacity: table.capacity },
          $setOnInsert: {
            tableNumber: table.tableNumber,
            status: table.status,
          },
        },
        upsert: true,
      },
    }))
  );
}

async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    dbConnected = true;
    await seedDatabase();
    console.log("MongoDB connected successfully");
  } catch (error) {
    dbConnected = false;
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
}

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    database: dbConnected ? "mongodb" : "memory",
    message: "Restaurant API is running",
  });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email: String(email).trim().toLowerCase() });

    if (!user || user.password !== String(password)) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    return res.json({ success: true, user: serializeUser(user), token: "demo-token" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Login failed." });
  }
});

app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password, role = "customer", phone = "" } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email and password are required." });
  }

  try {
    const existing = await User.findOne({ email: String(email).trim().toLowerCase() });

    if (existing) {
      return res.status(409).json({ success: false, message: "Email already exists." });
    }

    const newUser = await User.create({
      name,
      email: String(email).trim().toLowerCase(),
      password,
      role,
      phone,
    });

    return res.status(201).json({ success: true, user: serializeUser(newUser), token: "demo-token" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Signup failed." });
  }
});

app.get("/api/menu", async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1, name: 1 });
    res.json(items.map(serializeMenuItem));
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load menu." });
  }
});

app.post("/api/menu", async (req, res) => {
  const { name, description, price, category, image, isSpecial, isAvailable } = req.body;

  if (!name || !price) {
    return res.status(400).json({ success: false, message: "Menu item name and price are required." });
  }

  try {
    const newItem = await MenuItem.create({
      name,
      description: description || "New restaurant item",
      price: Number(price),
      category: category || "Mains",
      image: image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      isSpecial: Boolean(isSpecial),
      isAvailable: typeof isAvailable === "boolean" ? isAvailable : true,
    });

    return res.status(201).json({ success: true, item: serializeMenuItem(newItem) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to add menu item." });
  }
});

app.patch("/api/menu/:id/availability", async (req, res) => {
  const { id } = req.params;
  const { isAvailable } = req.body;

  try {
    const item = await MenuItem.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Menu item not found." });
    }

    item.isAvailable = typeof isAvailable === "boolean" ? isAvailable : !item.isAvailable;
    await item.save();

    return res.json({ success: true, item: serializeMenuItem(item) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update menu item." });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders.map(serializeOrder));
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load orders." });
  }
});

app.post("/api/orders", async (req, res) => {
  const { items, total, type, tableNumber, pickupTime, status = "Pending", userId } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "Order items are required." });
  }

  try {
    const newOrder = await Order.create({
      items,
      total,
      type,
      tableNumber: type === "Dine-in" ? tableNumber : null,
      pickupTime: type === "Takeaway" ? pickupTime : null,
      status,
      userId: userId || null,
      timestamp: Date.now(),
    });

    return res.status(201).json({ success: true, order: serializeOrder(newOrder) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to place order." });
  }
});

app.patch("/api/orders/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { status: status || "Pending" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    return res.json({ success: true, order: serializeOrder(order) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update order status." });
  }
});

app.get("/api/reservations", async (req, res) => {
  try {
    const filter = req.query.userId
      ? { userId: String(req.query.userId) }
      : {};
    const reservations = await Reservation.find(filter).sort({ createdAt: -1 });
    res.json(reservations.map(serializeReservation));
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load reservations." });
  }
});

app.post("/api/reservations", async (req, res) => {
  const { customerName, date, time, guests, phone, tableNumber, userId } = req.body;

  if (!customerName || !date || !time || !guests || !tableNumber) {
    return res.status(400).json({ success: false, message: "Reservation fields are incomplete." });
  }

  try {
    const table = await Table.findOne({ tableNumber: Number(tableNumber) });
    if (!table) {
      return res.status(404).json({ success: false, message: "Selected table not found." });
    }
    if (table.capacity < Number(guests)) {
      return res.status(400).json({ success: false, message: "Selected table cannot accommodate this party." });
    }

    const existingReservation = await Reservation.findOne({
      tableNumber: Number(tableNumber),
      date,
      time,
      status: { $nin: ["Cancelled", "Rejected"] },
    });
    if (existingReservation) {
      return res.status(409).json({ success: false, message: "Selected table is already reserved for this time." });
    }

    const reservation = await Reservation.create({
      customerName,
      date,
      time,
      guests: Number(guests),
      phone: phone || "",
      tableNumber: Number(tableNumber),
      userId: userId || null,
      status: "Pending",
    });

    return res.status(201).json({ success: true, reservation: serializeReservation(reservation) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create reservation." });
  }
});

app.patch("/api/reservations/:id/status", async (req, res) => {
  const allowedStatuses = ["Pending", "Accepted", "Rejected", "Cancelled"];
  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid reservation status." });
  }

  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({ success: false, message: "Reservation not found." });
    }

    return res.json({ success: true, reservation: serializeReservation(reservation) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update reservation." });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users.map(serializeUser));
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load users." });
  }
});

app.get("/api/tables", async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    const { date, time } = req.query;
    let reservedTableNumbers = new Set();

    if (date && time) {
      const reservations = await Reservation.find({
        date: String(date),
        time: String(time),
        status: { $nin: ["Cancelled", "Rejected"] },
      }).select("tableNumber");
      reservedTableNumbers = new Set(
        reservations.map((reservation) => reservation.tableNumber)
      );
    }

    res.json(
      tables.map((table) => ({
        ...serializeTable(table),
        available:
          table.status === "available" &&
          !reservedTableNumbers.has(table.tableNumber),
      }))
    );
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load tables." });
  }
});

app.patch("/api/tables/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const table = await Table.findByIdAndUpdate(id, { status }, { new: true });

    if (!table) {
      return res.status(404).json({ success: false, message: "Table not found." });
    }

    return res.json({ success: true, table: serializeTable(table) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update table." });
  }
});

async function startServer() {
  try {
    await connectDatabase();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
    return;
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on("error", (error) => {
    console.error(`HTTP server failed to start: ${error.message}`);
    mongoose.disconnect().finally(() => {
      process.exitCode = 1;
    });
  });
}

startServer();
