import {
  query,
  update,
  text,
  Null,
  Record,
  StableBTreeMap,
  Variant,
  Vec,
  Ok,
  Err,
  ic,
  Principal,
  nat64,
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
  AuthenticationFailed: text
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
const emailUsedStorage = StableBTreeMap(5, text, bool);

// Canister Definition
export default Canister({
  // Create a new user
  createUserProfile: update([UserPayload], Result(User, Message), (payload) => {
    // Validate the payload
    // @ts-ignore
    const validatePayloadErrors = validateUserPayload(payload);
    if (validatePayloadErrors.length) {
      return Err({
        InvalidPayload: `Invalid payload. Errors=[${validatePayloadErrors}]`,
      });
    }

    // Ensure the email for each user is unique
    if (emailUsedStorage.containsKey(payload.email)) {
      return Err({
        InvalidPayload: `Email:${payload.email} is already in use.`,
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
    emailUsedStorage.insert(payload.email, true);
    usersStorage.insert(userId, user);
    return Ok(user);
  }),

  // Update user profile
  updateUserProfile: update(
    [text, UserPayload],
    Result(User, Message),
    (userId, payload) => {
      // Validate the payload
      // @ts-ignore
      const validatePayloadErrors = validateUserPayload(payload);
      if (validatePayloadErrors.length) {
        return Err({
          InvalidPayload: `Invalid payload. Errors=[${validatePayloadErrors}]`,
        });
      }
      // Update the user after validation
      const userOpt = usersStorage.get(userId);
      if ("None" in userOpt) {
        return Err({ NotFound: "User not found" });
      }
      if (userOpt.Some.owner.toString() !== ic.caller().toString()) {
        return Err({
          AuthenticationFailed: "Only the principal of the profile can update.",
        });
      }

      const user = userOpt["Some"];
      if (user.email !== payload.email) {
        // Ensure the new email isn't used
        if (emailUsedStorage.containsKey(payload.email)) {
          return Err({
            InvalidPayload: `Email:${payload.email} is already in use.`,
          });
        }
        emailUsedStorage.remove(user.email);
        emailUsedStorage.insert(payload.email, true);
      }
      const updatedUser = {
        ...user,
        ...payload,
      };

      usersStorage.insert(userId, updatedUser);
      return Ok(updatedUser);
    }
  ),

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
    if (
      !isValidUuid(payload.userId) ||
      isInvalidString(payload.size) ||
      isInvalidString(payload.location)
    ) {
      return Err({
        InvalidPayload:
          "Ensure the input data provided is in the valid format.",
      });
    }

    // Verify whether a user with userId exists
    if (!usersStorage.containsKey(payload.userId)) {
      return Err({ NotFound: "User not found" });
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
  }),

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
      if (
        !isValidUuid(payload.plotId) ||
        isInvalidString(payload.description) ||
        isInvalidString(payload.date)
      ) {
        return Err({
          InvalidPayload:
            "Ensure the input data provided is in the valid format.",
        });
      }

      // Verify whether a plot with plotId exists
      if (!plotsStorage.containsKey(payload.plotId)) {
        return Err({ NotFound: "Plot not found" });
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
      if (
        isInvalidString(payload.name) ||
        !payload.quantity ||
        !payload.available
      ) {
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
  createEvent: update([EventPayload], Result(Event, Message), (payload) => {
    // Validate the payload
    if (
      isInvalidString(payload.title) ||
      isInvalidString(payload.description) ||
      isInvalidString(payload.date) ||
      isInvalidString(payload.location)
    ) {
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
  }),

  // Retrieve all events
  getAllEvents: query([], Vec(Event), () => {
    return eventsStorage.values();
  }),
});


// Helper function that trims the input string and then checks the length
// The string is empty if true is returned, otherwise, string is a valid value
function isInvalidString(str: text): boolean {
  return str.trim().length == 0;
}

// Helper function to ensure the input id meets the format used for ids generated by uuid
function isValidUuid(id: string): boolean {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(id);
}

/**
 * Helper function to validate the UserPayload
 */
function validateUserPayload(payload: typeof UserPayload): Vec<string> {
  const errors: Vec<text> = [];

  const phoneNumberRegex = /^[+]{1}(?:[0-9\-\\(\\)\\/.]\s?){6,15}[0-9]{1}$/;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  // @ts-ignore
  if (isInvalidString(payload.name)) {
    errors.push(`name='${payload.name}' cannot be empty.`);
  }
  // @ts-ignore
  if (!phoneNumberRegex.test(payload.phoneNumber)) {
    errors.push(`phoneNumber='${payload.phoneNumber}' is not in the valid format.`);
  }
  // @ts-ignore
  if (!emailRegex.test(payload.email)) {
    errors.push(`email='${payload.email}' is not in the valid format.`);
  }
  return errors;
}
