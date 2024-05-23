// Import necessary libraries
import { v4 as uuidv4 } from "uuid";
import { Server, StableBTreeMap, Principal } from "azle";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
import moment from "moment";
import crypto from "crypto";

// Generate a strong, random JWT secret key
const JWT_SECRET = crypto.randomBytes(64).toString('hex');

// Define the User class to represent users of the platform
class User {
  id: string;
  name: string;
  email: string;
  password: string; // Store hashed passwords
  createdAt: Date;

  constructor(name: string, email: string, password: string) {
    this.id = uuidv4();
    this.name = name;
    this.email = email;
    this.password = bcrypt.hashSync(password, 8); // Hash password
    this.createdAt = new Date();
  }
}

// Define the Plot class to represent garden plots
class Plot {
  id: string;
  userId: string;
  size: string;
  location: string;
  reservedUntil: Date;
  createdAt: Date;

  constructor(userId: string, size: string, location: string, reservedUntil: Date) {
    this.id = uuidv4();
    this.userId = userId;
    this.size = size;
    this.location = location;
    this.reservedUntil = reservedUntil;
    this.createdAt = new Date();
  }
}

// Define the Activity class to represent gardening activities
class Activity {
  id: string;
  plotId: string;
  description: string;
  date: Date;
  createdAt: Date;

  constructor(plotId: string, description: string, date: Date) {
    this.id = uuidv4();
    this.plotId = plotId;
    this.description = description;
    this.date = date;
    this.createdAt = new Date();
  }
}

// Define the Resource class to represent shared resources
class Resource {
  id: string;
  name: string;
  quantity: number;
  available: boolean;
  createdAt: Date;

  constructor(name: string, quantity: number, available: boolean) {
    this.id = uuidv4();
    this.name = name;
    this.quantity = quantity;
    this.available = available;
    this.createdAt = new Date();
  }
}

// Define the Event class to represent community events
class Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  createdAt: Date;

  constructor(title: string, description: string, date: Date, location: string) {
    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.date = date;
    this.location = location;
    this.createdAt = new Date();
  }
}

// Initialize stable maps for storing garden data
const usersStorage = new StableBTreeMap<string, User>(0);
const plotsStorage = new StableBTreeMap<string, Plot>(1);
const activitiesStorage = new StableBTreeMap<string, Activity>(2);
const resourcesStorage = new StableBTreeMap<string, Resource>(3);
const eventsStorage = new StableBTreeMap<string, Event>(4);

// Define the express server
export default Server(() => {
  const app = express();
  app.use(bodyParser.json());

  // Middleware for error handling
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "An unexpected error occurred." });
  });

  // Middleware for authentication
  const authenticateToken = (req: any, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // Endpoint for user registration
  app.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || typeof name !== "string" || !email || typeof email !== "string" || !password || typeof password !== "string") {
      res.status(400).json({
        error: "Invalid input: Ensure 'name', 'email', and 'password' are provided and are strings.",
      });
      return;
    }

    try {
      const user = new User(name, email, password);
      usersStorage.insert(user.id, user);
      res.status(201).json({
        message: "User registered successfully",
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (error) {
      console.error("Failed to register user:", error);
      res.status(500).json({
        error: "Server error occurred while registering the user.",
      });
    }
  });

  // Endpoint for user login
  app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
      res.status(400).json({
        error: "Invalid input: Ensure 'email' and 'password' are provided and are strings.",
      });
      return;
    }

    try {
      const user = Array.from(usersStorage.values()).find(user => user.email === email);
      if (!user || !bcrypt.compareSync(password, user.password)) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({
        message: "Login successful",
        token,
      });
    } catch (error) {
      console.error("Failed to login user:", error);
      res.status(500).json({
        error: "Server error occurred while logging in the user.",
      });
    }
  });

  // Endpoint for creating a new plot
  app.post("/plots", authenticateToken, (req: any, res) => {
    const { size, location, reservedUntil } = req.body;

    if (!size || typeof size !== "string" || !location || typeof location !== "string" || !reservedUntil || !moment(reservedUntil, moment.ISO_8601, true).isValid()) {
      res.status(400).json({
        error: "Invalid input: Ensure 'size', 'location', and 'reservedUntil' are provided and are of the correct types.",
      });
      return;
    }

    try {
      const plot = new Plot(req.user.userId, size, location, new Date(reservedUntil));
      plotsStorage.insert(plot.id, plot);
      res.status(201).json({
        message: "Plot created successfully",
        plot,
      });
    } catch (error) {
      console.error("Failed to create plot:", error);
      res.status(500).json({
        error: "Server error occurred while creating the plot.",
      });
    }
  });

  // Endpoint for retrieving all plots
  app.get("/plots", authenticateToken, (req, res) => {
    try {
      const plots = plotsStorage.values();
      res.status(200).json({
        message: "Plots retrieved successfully",
        plots,
      });
    } catch (error) {
      console.error("Failed to retrieve plots:", error);
      res.status(500).json({
        error: "Server error occurred while retrieving plots.",
      });
    }
  });

  // Endpoint for creating a new activity
  app.post("/activities", authenticateToken, (req: any, res) => {
    const { plotId, description, date } = req.body;

    if (!plotId || typeof plotId !== "string" || !description || typeof description !== "string" || !date || !moment(date, moment.ISO_8601, true).isValid()) {
      res.status(400).json({
        error: "Invalid input: Ensure 'plotId', 'description', and 'date' are provided and are of the correct types.",
      });
      return;
    }

    try {
      const plot = plotsStorage.get(plotId);
      if (!plot) {
        res.status(404).json({ error: "Plot not found" });
        return;
      }

      if (plot.userId !== req.user.userId) {
        res.status(403).json({ error: "Unauthorized to add activity to this plot" });
        return;
      }

      const activity = new Activity(plotId, description, new Date(date));
      activitiesStorage.insert(activity.id, activity);
      res.status(201).json({
        message: "Activity created successfully",
        activity,
      });
    } catch (error) {
      console.error("Failed to create activity:", error);
      res.status(500).json({
        error: "Server error occurred while creating the activity.",
      });
    }
  });

  // Endpoint for retrieving all activities
  app.get("/activities", authenticateToken, (req, res) => {
    try {
      const activities = activitiesStorage.values();
      res.status(200).json({
        message: "Activities retrieved successfully",
        activities,
      });
    } catch (error) {
      console.error("Failed to retrieve activities:", error);
      res.status(500).json({
        error: "Server error occurred while retrieving activities.",
      });
    }
  });

  // Endpoint for creating a new resource
  app.post("/resources", authenticateToken, (req, res) => {
    const { name, quantity, available } = req.body;

    if (!name || typeof name !== "string" || !quantity || typeof quantity !== "number" || available === undefined || typeof available !== "boolean") {
      res.status(400).json({
        error: "Invalid input: Ensure 'name', 'quantity', and 'available' are provided and are of the correct types.",
      });
      return;
    }

    try {
      const resource = new Resource(name, quantity, available);
      resourcesStorage.insert(resource.id, resource);
      res.status(201).json({
        message: "Resource created successfully",
        resource,
      });
    } catch (error) {
      console.error("Failed to create resource:", error);
      res.status(500).json({
        error: "Server error occurred while creating the resource.",
      });
    }
  });

  // Endpoint for retrieving all resources
  app.get("/resources", authenticateToken, (req, res) => {
    try {
      const resources = resourcesStorage.values();
      res.status(200).json({
        message: "Resources retrieved successfully",
        resources,
      });
    } catch (error) {
      console.error("Failed to retrieve resources:", error);
      res.status(500).json({
        error: "Server error occurred while retrieving resources.",
      });
    }
  });

  // Endpoint for creating a new event
  app.post("/events", authenticateToken, (req, res) => {
    const { title, description, date, location } = req.body;

    if (!title || typeof title !== "string" || !description || typeof description !== "string" || !date || !moment(date, moment.ISO_8601, true).isValid() || !location || typeof location !== "string") {
      res.status(400).json({
        error: "Invalid input: Ensure 'title', 'description', 'date', and 'location' are provided and are of the correct types.",
      });
      return;
    }

    try {
      const event = new Event(title, description, new Date(date), location);
      eventsStorage.insert(event.id, event);
      res.status(201).json({
        message: "Event created successfully",
        event,
      });
    } catch (error) {
      console.error("Failed to create event:", error);
      res.status(500).json({
        error: "Server error occurred while creating the event.",
      });
    }
  });

  // Endpoint for retrieving all events
  app.get("/events", authenticateToken, (req, res) => {
    try {
      const events = eventsStorage.values();
      res.status(200).json({
        message: "Events retrieved successfully",
        events,
      });
    } catch (error) {
      console.error("Failed to retrieve events:", error);
      res.status(500).json({
        error: "Server error occurred while retrieving events.",
      });
    }
  });

  // Start the server
  return app.listen();
});
