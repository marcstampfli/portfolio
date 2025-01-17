import { type NextRequest } from "next/server";
import { projects } from "@/data/projects";

export async function GET(request: NextRequest) {
  return Response.json(projects);
}
