// Import necessary libraries
import { v4 as uuidv4 } from "uuid";
import { Server, StableBTreeMap, Principal } from "azle";
import express from "express";

// Define the User class to represent users of the platform
class User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;

  constructor(name: string, email: string) {
    this.id = uuidv4();
    this.name = name;
    this.email = email;
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
const usersStorage = StableBTreeMap<string, User>(0);
const plotsStorage = StableBTreeMap<string, Plot>(1);
const activitiesStorage = StableBTreeMap<string, Activity>(2);
const resourcesStorage = StableBTreeMap<string, Resource>(3);
const eventsStorage = StableBTreeMap<string, Event>(4);

// Define the express server
export default Server(() => {
  const app = express();
  app.use(express.json());

  // Endpoint for creating a new user
  app.post("/users", (req, res) => {
    if (
      !req.body.name ||
      typeof req.body.name !== "string" ||
      !req.body.email ||
      typeof req.body.email !== "string"
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'name' and 'email' are provided and are strings.",
      });
      return;
    }

    try {
      const user = new User(
        req.body.name,
        req.body.email
      );
      usersStorage.insert(user.id, user);
      res.status(201).json({
        message: "User created successfully",
        user: user,
      });
    } catch (error) {
      console.error("Failed to create user:", error);
      res.status(500).json({
        error: "Server error occurred while creating the user.",
      });
    }
  });

  // Endpoint for retrieving all users
  app.get("/users", (req, res) => {
    try {
      const users = usersStorage.values();
      res.status(200).json({
        message: "Users retrieved successfully",
        users: users,
      });
    } catch (error) {
      console.error("Failed to retrieve users:", error);
      res.status(500).json({
        error: "Server error occurred while retrieving users.",
      });
    }
  });

  // Endpoint for creating a new plot
  app.post("/plots", (req, res) => {
    if (
      !req.body.userId ||
      typeof req.body.userId !== "string" ||
      !req.body.size ||
      typeof req.body.size !== "string" ||
      !req.body.location ||
      typeof req.body.location !== "string" ||
      !req.body.reservedUntil
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'userId', 'size', 'location', and 'reservedUntil' are provided and are of the correct types.",
      });
      return;
    }

    try {
      const plot = new Plot(
        req.body.userId,
        req.body.size,
        req.body.location,
        new Date(req.body.reservedUntil)
      );
      plotsStorage.insert(plot.id, plot);
      res.status(201).json({
        message: "Plot created successfully",
        plot: plot,
      });
    } catch (error) {
      console.error("Failed to create plot:", error);
      res.status(500).json({
        error: "Server error occurred while creating the plot.",
      });
    }
  });

  // Endpoint for retrieving all plots
  app.get("/plots", (req, res) => {
    try {
      const plots = plotsStorage.values();
      res.status(200).json({
        message: "Plots retrieved successfully",
        plots: plots,
      });
    } catch (error) {
      console.error("Failed to retrieve plots:", error);
      res.status(500).json({
        error: "Server error occurred while retrieving plots.",
      });
    }
  });

  // Endpoint for creating a new activity
  app.post("/activities", (req, res) => {
    if (
      !req.body.plotId ||
      typeof req.body.plotId !== "string" ||
      !req.body.description ||
      typeof req.body.description !== "string" ||
      !req.body.date
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'plotId', 'description', and 'date' are provided and are of the correct types.",
      });
      return;
    }

    try {
      const activity = new Activity(
        req.body.plotId,
        req.body.description,
        new Date(req.body.date)
      );
      activitiesStorage.insert(activity.id, activity);
      res.status(201).json({
        message: "Activity created successfully",
        activity: activity,
      });
    } catch (error) {
      console.error("Failed to create activity:", error);
      res.status(500).json({
        error: "Server error occurred while creating the activity.",
      });
    }
  });

  // Endpoint for retrieving all activities
  app.get("/activities", (req, res) => {
    try {
      const activities = activitiesStorage.values();
      res.status(200).json({
        message: "Activities retrieved successfully",
        activities: activities,
      });
    } catch (error) {
      console.error("Failed to retrieve activities:", error);
      res.status(500).json({
        error: "Server error occurred while retrieving activities.",
      });
    }
  });

  // Endpoint for creating a new resource
  app.post("/resources", (req, res) => {
    if (
      !req.body.name ||
      typeof req.body.name !== "string" ||
      !req.body.quantity ||
      typeof req.body.quantity !== "number" ||
      !req.body.available ||
      typeof req.body.available !== "boolean"
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'name', 'quantity', and 'available' are provided and are of the correct types.",
      });
      return;
    }

    try {
      const resource = new Resource(
        req.body.name,
        req.body.quantity,
        req.body.available
      );
      resourcesStorage.insert(resource.id, resource);
      res.status(201).json({
        message: "Resource created successfully",
        resource: resource,
      });
    } catch (error) {
      console.error("Failed to create resource:", error);
      res.status(500).json({
        error: "Server error occurred while creating the resource.",
      });
    }
  });

  // Endpoint for retrieving all resources
  app.get("/resources", (req, res) => {
    try {
      const resources = resourcesStorage.values();
      res.status(200).json({
        message: "Resources retrieved successfully",
        resources: resources,
      });
    } catch (error) {
      console.error("Failed to retrieve resources:", error);
      res.status(500).json({
        error: "Server error occurred while retrieving resources.",
      });
    }
  });

  // Endpoint for creating a new event
  app.post("/events", (req, res) => {
    if (
      !req.body.title ||
      typeof req.body.title !== "string" ||
      !req.body.description ||
      typeof req.body.description !== "string" ||
      !req.body.date ||
      !req.body.location ||
      typeof req.body.location !== "string"
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'title', 'description', 'date', and 'location' are provided and are of the correct types.",
      });
      return;
    }

    try {
      const event = new Event(
        req.body.title,
        req.body.description,
        new Date(req.body.date),
        req.body.location
      );
      eventsStorage.insert(event.id, event);
      res.status(201).json({
        message: "Event created successfully",
        event: event,
      });
    } catch (error) {
      console.error("Failed to create event:", error);
      res.status(500).json({
        error: "Server error occurred while creating the event.",
      });
    }
  });

  // Endpoint for retrieving all events
  app.get("/events", (req, res) => {
    try {
      const events = eventsStorage.values();
      res.status(200).json({
        message: "Events retrieved successfully",
        events: events,
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
