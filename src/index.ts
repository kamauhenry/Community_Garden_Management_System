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

  // Helper function to handle not found entities
  const handleNotFound = (res: express.Response, entity: string) => {
    res.status(404).json({
      error: `${entity} not found.`,
    });
  };

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
      const user = new User(req.body.name, req.body.email);
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

  // Endpoint for updating a user
  app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (
      (name && typeof name !== "string") ||
      (email && typeof email !== "string")
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'name' and 'email' are strings.",
      });
      return;
    }

    try {
      const user = usersStorage.get(id);
      if (!user) {
        handleNotFound(res, "User");
        return;
      }

      user.name = name || user.name;
      user.email = email || user.email;
      usersStorage.insert(id, user);
      res.status(200).json({
        message: "User updated successfully",
        user: user,
      });
    } catch (error) {
      console.error("Failed to update user:", error);
      res.status(500).json({
        error: "Server error occurred while updating the user.",
      });
    }
  });

  // Endpoint for deleting a user
  app.delete("/users/:id", (req, res) => {
    const { id } = req.params;

    try {
      const user = usersStorage.get(id);
      if (!user) {
        handleNotFound(res, "User");
        return;
      }

      usersStorage.remove(id);
      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete user:", error);
      res.status(500).json({
        error: "Server error occurred while deleting the user.",
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

  // Endpoint for updating a plot
  app.put("/plots/:id", (req, res) => {
    const { id } = req.params;
    const { size, location, reservedUntil } = req.body;

    if (
      (size && typeof size !== "string") ||
      (location && typeof location !== "string") ||
      (reservedUntil && isNaN(Date.parse(reservedUntil)))
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'size', 'location', and 'reservedUntil' are of the correct types.",
      });
      return;
    }

    try {
      const plot = plotsStorage.get(id);
      if (!plot) {
        handleNotFound(res, "Plot");
        return;
      }

      plot.size = size || plot.size;
      plot.location = location || plot.location;
      plot.reservedUntil = reservedUntil ? new Date(reservedUntil) : plot.reservedUntil;
      plotsStorage.insert(id, plot);
      res.status(200).json({
        message: "Plot updated successfully",
        plot: plot,
      });
    } catch (error) {
      console.error("Failed to update plot:", error);
      res.status(500).json({
        error: "Server error occurred while updating the plot.",
      });
    }
  });

  // Endpoint for deleting a plot
  app.delete("/plots/:id", (req, res) => {
    const { id } = req.params;

    try {
      const plot = plotsStorage.get(id);
      if (!plot) {
        handleNotFound(res, "Plot");
        return;
      }

      plotsStorage.remove(id);
      res.status(200).json({
        message: "Plot deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete plot:", error);
      res.status(500).json({
        error: "Server error occurred while deleting the plot.",
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

  // Endpoint for updating an activity
  app.put("/activities/:id", (req, res) => {
    const { id } = req.params;
    const { description, date } = req.body;

    if (
      (description && typeof description !== "string") ||
      (date && isNaN(Date.parse(date)))
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'description' and 'date' are of the correct types.",
      });
      return;
    }

    try {
      const activity = activitiesStorage.get(id);
      if (!activity) {
        handleNotFound(res, "Activity");
        return;
      }

      activity.description = description || activity.description;
      activity.date = date ? new Date(date) : activity.date;
      activitiesStorage.insert(id, activity);
      res.status(200).json({
        message: "Activity updated successfully",
        activity: activity,
      });
    } catch (error) {
      console.error("Failed to update activity:", error);
      res.status(500).json({
        error: "Server error occurred while updating the activity.",
      });
    }
  });

  // Endpoint for deleting an activity
  app.delete("/activities/:id", (req, res) => {
    const { id } = req.params;

    try {
      const activity = activitiesStorage.get(id);
      if (!activity) {
        handleNotFound(res, "Activity");
        return;
      }

      activitiesStorage.remove(id);
      res.status(200).json({
        message: "Activity deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete activity:", error);
      res.status(500).json({
        error: "Server error occurred while deleting the activity.",
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

  // Endpoint for updating a resource
  app.put("/resources/:id", (req, res) => {
    const { id } = req.params;
    const { name, quantity, available } = req.body;

    if (
      (name && typeof name !== "string") ||
      (quantity && typeof quantity !== "number") ||
      (available !== undefined && typeof available !== "boolean")
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'name', 'quantity', and 'available' are of the correct types.",
      });
      return;
    }

    try {
      const resource = resourcesStorage.get(id);
      if (!resource) {
        handleNotFound(res, "Resource");
        return;
      }

      resource.name = name || resource.name;
      resource.quantity = quantity || resource.quantity;
      resource.available = available !== undefined ? available : resource.available;
      resourcesStorage.insert(id, resource);
      res.status(200).json({
        message: "Resource updated successfully",
        resource: resource,
      });
    } catch (error) {
      console.error("Failed to update resource:", error);
      res.status(500).json({
        error: "Server error occurred while updating the resource.",
      });
    }
  });

  // Endpoint for deleting a resource
  app.delete("/resources/:id", (req, res) => {
    const { id } = req.params;

    try {
      const resource = resourcesStorage.get(id);
      if (!resource) {
        handleNotFound(res, "Resource");
        return;
      }

      resourcesStorage.remove(id);
      res.status(200).json({
        message: "Resource deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete resource:", error);
      res.status(500).json({
        error: "Server error occurred while deleting the resource.",
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

  // Endpoint for updating an event
  app.put("/events/:id", (req, res) => {
    const { id } = req.params;
    const { title, description, date, location } = req.body;

    if (
      (title && typeof title !== "string") ||
      (description && typeof description !== "string") ||
      (date && isNaN(Date.parse(date))) ||
      (location && typeof location !== "string")
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'title', 'description', 'date', and 'location' are of the correct types.",
      });
      return;
    }

    try {
      const event = eventsStorage.get(id);
      if (!event) {
        handleNotFound(res, "Event");
        return;
      }

      event.title = title || event.title;
      event.description = description || event.description;
      event.date = date ? new Date(date) : event.date;
      event.location = location || event.location;
      eventsStorage.insert(id, event);
      res.status(200).json({
        message: "Event updated successfully",
        event: event,
      });
    } catch (error) {
      console.error("Failed to update event:", error);
      res.status(500).json({
        error: "Server error occurred while updating the event.",
      });
    }
  });

  // Endpoint for deleting an event
  app.delete("/events/:id", (req, res) => {
    const { id } = req.params;

    try {
      const event = eventsStorage.get(id);
      if (!event) {
        handleNotFound(res, "Event");
        return;
      }

      eventsStorage.remove(id);
      res.status(200).json({
        message: "Event deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete event:", error);
      res.status(500).json({
        error: "Server error occurred while deleting the event.",
      });
    }
  });

  // Start the server
  return app.listen();
});