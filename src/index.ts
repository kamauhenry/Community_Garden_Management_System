import { v4 as uuidv4 } from "uuid";
import { Server, StableBTreeMap, Principal } from "azle";
import express from "express";

// Utility function for error handling
function handleError(res, error, message) {
    console.error(message, error);
    res.status(500).json({ error: message });
}

// Utility function for validation
function validateFields(fields, body) {
    for (const [field, type] of Object.entries(fields)) {
        if (!body[field] || typeof body[field] !== type) {
            return `Invalid input: Ensure '${field}' is provided and is of type '${type}'.`;
        }
    }
    return null;
}

// Define the User class
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

// Define the Plot class
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

// Define the Activity class
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

// Define the Resource class
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

// Define the Event class
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
    app.use(express.json());

    // Endpoint for creating a new user
    app.post("/users", (req, res) => {
        const errorMessage = validateFields({ name: "string", email: "string" }, req.body);
        if (errorMessage) {
            return res.status(400).json({ error: errorMessage });
        }

        try {
            const user = new User(req.body.name, req.body.email);
            usersStorage.insert(user.id, user);
            res.status(201).json({ message: "User created successfully", user });
        } catch (error) {
            handleError(res, error, "Failed to create user.");
        }
    });

    // Endpoint for retrieving all users
    app.get("/users", (req, res) => {
        try {
            const users = usersStorage.values();
            res.status(200).json({ message: "Users retrieved successfully", users });
        } catch (error) {
            handleError(res, error, "Failed to retrieve users.");
        }
    });

    // Endpoint for creating a new plot
    app.post("/plots", (req, res) => {
        const errorMessage = validateFields(
            { userId: "string", size: "string", location: "string", reservedUntil: "string" },
            req.body
        );
        if (errorMessage) {
            return res.status(400).json({ error: errorMessage });
        }

        try {
            const reservedUntilDate = new Date(req.body.reservedUntil);
            if (isNaN(reservedUntilDate.getTime())) {
                throw new Error("Invalid date format for reservedUntil");
            }

            const plot = new Plot(req.body.userId, req.body.size, req.body.location, reservedUntilDate);
            plotsStorage.insert(plot.id, plot);
            res.status(201).json({ message: "Plot created successfully", plot });
        } catch (error) {
            handleError(res, error, "Failed to create plot.");
        }
    });

    // Endpoint for retrieving all plots
    app.get("/plots", (req, res) => {
        try {
            const plots = plotsStorage.values();
            res.status(200).json({ message: "Plots retrieved successfully", plots });
        } catch (error) {
            handleError(res, error, "Failed to retrieve plots.");
        }
    });

    // Endpoint for creating a new activity
    app.post("/activities", (req, res) => {
        const errorMessage = validateFields(
            { plotId: "string", description: "string", date: "string" },
            req.body
        );
        if (errorMessage) {
            return res.status(400).json({ error: errorMessage });
        }

        try {
            const activityDate = new Date(req.body.date);
            if (isNaN(activityDate.getTime())) {
                throw new Error("Invalid date format for date");
            }

            const activity = new Activity(req.body.plotId, req.body.description, activityDate);
            activitiesStorage.insert(activity.id, activity);
            res.status(201).json({ message: "Activity created successfully", activity });
        } catch (error) {
            handleError(res, error, "Failed to create activity.");
        }
    });

    // Endpoint for retrieving all activities
    app.get("/activities", (req, res) => {
        try {
            const activities = activitiesStorage.values();
            res.status(200).json({ message: "Activities retrieved successfully", activities });
        } catch (error) {
            handleError(res, error, "Failed to retrieve activities.");
        }
    });

    // Endpoint for creating a new resource
    app.post("/resources", (req, res) => {
        const errorMessage = validateFields(
            { name: "string", quantity: "number", available: "boolean" },
            req.body
        );
        if (errorMessage) {
            return res.status(400).json({ error: errorMessage });
        }

        try {
            const resource = new Resource(req.body.name, req.body.quantity, req.body.available);
            resourcesStorage.insert(resource.id, resource);
            res.status(201).json({ message: "Resource created successfully", resource });
        } catch (error) {
            handleError(res, error, "Failed to create resource.");
        }
    });

    // Endpoint for retrieving all resources
    app.get("/resources", (req, res) => {
        try {
            const resources = resourcesStorage.values();
            res.status(200).json({ message: "Resources retrieved successfully", resources });
        } catch (error) {
            handleError(res, error, "Failed to retrieve resources.");
        }
    });

    // Endpoint for creating a new event
    app.post("/events", (req, res) => {
        const errorMessage = validateFields(
            { title: "string", description: "string", date: "string", location: "string" },
            req.body
        );
        if (errorMessage) {
            return res.status(400).json({ error: errorMessage });
        }

        try {
            const eventDate =
            const eventDate = new Date(req.body.date);
            if (isNaN(eventDate.getTime())) {
                throw new Error("Invalid date format for date");
            }

            const event = new Event(req.body.title, req.body.description, eventDate, req.body.location);
            eventsStorage.insert(event.id, event);
            res.status(201).json({ message: "Event created successfully", event });
        } catch (error) {
            handleError(res, error, "Failed to create event.");
        }
    });

    // Endpoint for retrieving all events
    app.get("/events", (req, res) => {
        try {
            const events = eventsStorage.values();
            res.status(200).json({ message: "Events retrieved successfully", events });
        } catch (error) {
            handleError(res, error, "Failed to retrieve events.");
        }
    });

    // Start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
