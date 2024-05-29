import { verify } from "@dfinity/agent";
import { auto } from "@popperjs/core";
import {
  query,
  update,
  text,
  Null,
  Record,
  StableBTreeMap,
  Variant,
  Vec,
  None,
  Some,
  Ok,
  Err,
  ic,
  Principal,
  Opt,
  nat64,
  Duration,
  Result,
  bool,
  Canister,
} from "azle";
import { v4 as uuidv4 } from "uuid";

// Define the User class to represent users of the platform
const User = Record({
  userId: text,
  owner: Principal,
  name: text,
  email: text,
  phoneNumber: text,
  createdAt: text,
});

const Plot = Record({
  id: text,
  userId: text,
  size: text,
  location: text,
  reservedUntil: text,
  createdAt: text,
});

const Activity = Record({
  id: text,
  plotId: text,
  description: text,
  date: text,
  createdAt: text,
});

const Resource = Record({
  id: text,
  name: text,
  quantity: nat64,
  available: bool,
  createdAt: text,
});

const Event = Record({
  id: text,
  title: text,
  description: text,
  date: text,
  location: text,
  createdAt: text,
});

// Message
const Message = Variant({
  Success: text,
  Error: text,
  NotFound: text,
  InvalidPayload: text,
});

// User Payload
const UserPayload = Record({
  name: text,
  email: text,
  phoneNumber: text,
});

// Plot Payload
const PlotPayload = Record({
  userId: text,
  size: text,
  location: text,
  reservedUntil: text,
});

// Activity Payload
const ActivityPayload = Record({
  plotId: text,
  description: text,
  date: text,
});

// Resource Payload
const ResourcePayload = Record({
  name: text,
  quantity: nat64,
  available: bool,
});

// Event Payload
const EventPayload = Record({
  title: text,
  description: text,
  date: text,
  location: text,
});

// Initialize stable maps for storing garden data
const usersStorage = StableBTreeMap(0, text, User);
const plotsStorage = StableBTreeMap(1, text, Plot);
const activitiesStorage = StableBTreeMap(2, text, Activity);
const resourcesStorage = StableBTreeMap(3, text, Resource);
const eventsStorage = StableBTreeMap(4, text, Event);

// Canister Definition
export default Canister({
  // Create a new user
  createUserProfile: update([UserPayload], Result(User, Message), (payload) => {
    // Validate the payload
    if (!payload.name || !payload.email || !payload.phoneNumber) {
      return Err({
        InvalidPayload:
          "Ensure 'name', 'email', and 'phoneNumber' are provided.",
      });
    }

    // Check for valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      return Err({
        InvalidPayload:
          "Invalid email format: Ensure the email is in the correct format.",
      });
    }

    // Ensure the email for each user is unique
    const users = usersStorage.values();
    for (const user of users) {
      if (user.email === payload.email) {
        return Err({
          InvalidPayload: "Email already exists: Ensure the email is unique.",
        });
      }
    }

    // Validate the phoneNumber
    const phoneNumberRegex = /^\d{10}$/;
    if (!phoneNumberRegex.test(payload.phoneNumber)) {
      return Err({
        InvalidPayload:
          "Invalid phone number: Ensure the phone number is in the correct format.",
      });
    }

    // Create the user after validation
    const userId = uuidv4();
    const user = {
      ...payload,
      userId,
      owner: ic.caller(),
      createdAt: ic.time().toString(), // Add createdAt field
    };

    usersStorage.insert(userId, user);
    return Ok(user);
  }),

  // Update user profile
  updateUserProfile: update([UserPayload], Result(User, Message), (payload) => {
    // Validate the payload
    if (!payload.name || !payload.email || !payload.phoneNumber) {
      return Err({
        InvalidPayload:
          "Ensure 'name', 'email', and 'phoneNumber' are provided.",
      });
    }

    // Check for valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      return Err({
        InvalidPayload:
          "Invalid email format: Ensure the email is in the correct format.",
      });
    }

    // Ensure the email for each user is unique
    const users = usersStorage.values();
    for (const user of users) {
      if (user.email === payload.email) {
        return Err({
          InvalidPayload: "Email already exists: Ensure the email is unique.",
        });
      }
    }

    // Validate the phoneNumber
    const phoneNumberRegex = /^\d{10}$/;
    if (!phoneNumberRegex.test(payload.phoneNumber)) {
      return Err({
        InvalidPayload:
          "Invalid phone number: Ensure the phone number is in the correct format.",
      });
    }

    // Update the user after validation
    const userId = ic.caller().toText();
    const userOpt = usersStorage.get(userId);
    if ("None" in userOpt) {
      return Err({ NotFound: "User not found" });
    }

    const user = userOpt["Some"];
    const updatedUser = {
      ...user,
      ...payload,
    };

    usersStorage.insert(userId, updatedUser);
    return Ok(updatedUser);
  }),

  // Get user by userId
  getUserProfile: query([text], Result(User, Message), (userId) => {
    const userOpt = usersStorage.get(userId);
    if ("None" in userOpt) {
      return Err({ NotFound: "User not found" });
    }

    return Ok(userOpt["Some"]);
  }),

  // Get User Profile by owner principal
  getUserProfileByOwner: query([], Result(User, Message), () => {
    const userProfile = usersStorage.values().filter((user) => {
      return user.owner.toText() === ic.caller().toText();
    });
    if (userProfile.length === 0) {
      return Err({ NotFound: "User not found" });
    }

    return Ok(userProfile[0]);
  }),

  // Create a new plot
  createPlot: update([PlotPayload], Result(Plot, Message), (payload) => {
    // Validate the payload
    if (!payload.userId || !payload.size || !payload.location) {
      return Err({
        InvalidPayload:
          "Ensure 'userId', 'size', and 'location' are provided.",
      });
    }

    // Create the plot after validation
    const plotId = uuidv4();
    const plot = {
      ...payload,
      id: plotId,
      reservedUntil: ic.time().toString(),
      createdAt: ic.time().toString(), // Add createdAt field
    };

    plotsStorage.insert(plotId, plot);
    return Ok(plot);
  }
  ),


  // Retrieve all plots
  getAllPlots: query([], Vec(Plot), () => {
    return plotsStorage.values();
  }),

  // Create a new activity
  createActivity: update(
    [ActivityPayload],
    Result(Activity, Message),
    (payload) => {
      // Validate the payload
      if (!payload.plotId || !payload.description || !payload.date) {
        return Err({
          InvalidPayload:
            "Ensure 'plotId', 'description', and 'date' are provided.",
        });
      }

      // Create the activity after validation
      const activityId = uuidv4();
      const activity = {
        ...payload,
        id: activityId,
        createdAt: ic.time().toString(), // Add createdAt field
      };

      activitiesStorage.insert(activityId, activity);
      return Ok(activity);
    }
  ),

  // Retrieve all activities
  getAllActivities: query([], Vec(Activity), () => {
    return activitiesStorage.values();
  }),

  // Create a new resource
  createResource: update(
    [ResourcePayload],
    Result(Resource, Message),
    (payload) => {
      // Validate the payload
      if (!payload.name || !payload.quantity || !payload.available) {
        return Err({
          InvalidPayload:
            "Ensure 'name', 'quantity', and 'available' are provided.",
        });
      }

      // Create the resource after validation
      const resourceId = uuidv4();
      const resource = {
        ...payload,
        id: resourceId,
        createdAt: ic.time().toString(), // Add createdAt field
      };

      resourcesStorage.insert(resourceId, resource);
      return Ok(resource);
    }
  ),

  // Retrieve all resources
  getAllResources: query([], Vec(Resource), () => {
    return resourcesStorage.values();
  }),

  // Create a new event
  createEvent: update(
    [EventPayload],
    Result(Event, Message),
    (payload) => {
      // Validate the payload
      if (!payload.title || !payload.description || !payload.date || !payload.location) {
        return Err({
          InvalidPayload:
            "Ensure 'title', 'description', 'date', and 'location' are provided.",
        });
      }

      // Create the event after validation
      const eventId = uuidv4();
      const event = {
        ...payload,
        id: eventId,
        createdAt: ic.time().toString(), // Add createdAt field
      };

      eventsStorage.insert(eventId, event);
      return Ok(event);
    }
  ),

  // Retrieve all events
  getAllEvents: query([], Vec(Event), () => {
    return eventsStorage.values();
  }),
});
