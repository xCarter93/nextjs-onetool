/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as activities from "../activities.js";
import type * as boldsign from "../boldsign.js";
import type * as boldsignActions from "../boldsignActions.js";
import type * as calendar from "../calendar.js";
import type * as clientContacts from "../clientContacts.js";
import type * as clientProperties from "../clientProperties.js";
import type * as clients from "../clients.js";
import type * as crons from "../crons.js";
import type * as documents from "../documents.js";
import type * as homeStats from "../homeStats.js";
import type * as http from "../http.js";
import type * as invoiceLineItems from "../invoiceLineItems.js";
import type * as invoices from "../invoices.js";
import type * as lib_activities from "../lib/activities.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_memberships from "../lib/memberships.js";
import type * as lib_shared from "../lib/shared.js";
import type * as notifications from "../notifications.js";
import type * as organizationDocuments from "../organizationDocuments.js";
import type * as organizations from "../organizations.js";
import type * as projects from "../projects.js";
import type * as quoteLineItems from "../quoteLineItems.js";
import type * as quotes from "../quotes.js";
import type * as skus from "../skus.js";
import type * as tasks from "../tasks.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  activities: typeof activities;
  boldsign: typeof boldsign;
  boldsignActions: typeof boldsignActions;
  calendar: typeof calendar;
  clientContacts: typeof clientContacts;
  clientProperties: typeof clientProperties;
  clients: typeof clients;
  crons: typeof crons;
  documents: typeof documents;
  homeStats: typeof homeStats;
  http: typeof http;
  invoiceLineItems: typeof invoiceLineItems;
  invoices: typeof invoices;
  "lib/activities": typeof lib_activities;
  "lib/auth": typeof lib_auth;
  "lib/memberships": typeof lib_memberships;
  "lib/shared": typeof lib_shared;
  notifications: typeof notifications;
  organizationDocuments: typeof organizationDocuments;
  organizations: typeof organizations;
  projects: typeof projects;
  quoteLineItems: typeof quoteLineItems;
  quotes: typeof quotes;
  skus: typeof skus;
  tasks: typeof tasks;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
