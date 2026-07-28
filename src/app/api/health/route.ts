import { siteConfig } from "@/config/site";
import type { ApiSuccess } from "@/types/api";

interface HealthData {
  readonly service: string;
  readonly status: "ok";
  readonly version: string;
}

export function GET(): Response {
  const response: ApiSuccess<HealthData> = {
    data: {
      service: siteConfig.name,
      status: "ok",
      version: siteConfig.version,
    },
    success: true,
  };

  return Response.json(response, {
    headers: {
      "Cache-Control": "no-store",
    },
    status: 200,
  });
}
