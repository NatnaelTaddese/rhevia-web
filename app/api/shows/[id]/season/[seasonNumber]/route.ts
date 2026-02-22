import { NextResponse } from "next/server";
import { getSeasonEpisodesData } from "@/lib/show-data";

interface RouteParams {
  params: Promise<{
    id: string;
    seasonNumber: string;
  }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id, seasonNumber } = await params;
  const showId = parseInt(id, 10);
  const season = parseInt(seasonNumber, 10);

  if (isNaN(showId) || isNaN(season)) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const data = await getSeasonEpisodesData(showId, season);

  if (!data) {
    return NextResponse.json({ error: "Season not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
