import { type Server } from "../../api/src/index";
import { edenTreaty } from "@elysiajs/eden";

export const baseURL = "http://localhost:3000";
export const api = edenTreaty<Server>(baseURL);
