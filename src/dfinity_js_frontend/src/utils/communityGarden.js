import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";

// createUserProfile
export async function createUserProfile(profile) {
  return window.canister.farmWorkChain.createUserProfile(profile);
}

// createPlot
export async function createPlot(plot) {
  return window.canister.farmWorkChain.createPlot(plot);
}


// createActivity
export async function createActivity(activity) {
  return window.canister.farmWorkChain.createActivity(activity);
}

// createResource
export async function createResource(resource) {
  return window.canister.farmWorkChain.createResource(resource);
}

// createEvent
export async function createEvent(event) {
  return window.canister.farmWorkChain.createEvent(event);
}

// getUserProfileByOwner
export async function getUserProfileByOwner(owner) {
  return window.canister.farmWorkChain.getUserProfileByOwner();
}

// getAllPlots
export async function getAllPlots() {
  return window.canister.farmWorkChain.getAllPlots();
}

// getAllActivities
export async function getAllActivities() {
  return window.canister.farmWorkChain.getAllActivities();
}

// getAllResources
export async function getAllResources() {
  return window.canister.farmWorkChain.getAllResources();
}

// getAllEvents
export async function getAllEvents() {
  return window.canister.farmWorkChain.getAllEvents();
}