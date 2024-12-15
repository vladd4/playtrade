import { Game } from "@/types/game.type";
import { privateAxios } from "./axios";

export async function getGames(): Promise<Game[] | null> {
  try {
    const { data } = await privateAxios.get<Game[]>("/games");
    return data;
  } catch (error: any) {
    console.log("Error getting games:", error.response?.data || error.message);
    return null;
  }
}

export async function getGameById(gameId: string): Promise<Game | null> {
  try {
    const { data } = await privateAxios.get<Game>(`/games/${gameId}`);
    return data;
  } catch (error: any) {
    console.log(
      "Error getting game by id:",
      error.response?.data || error.message
    );
    return null;
  }
}

export async function getSortedGames(
  order: "ASC" | "DESC"
): Promise<Game[] | null> {
  try {
    const { data } = await privateAxios.get<Game[]>(
      `/games/sort/alphabetical?order=${order}`
    );
    return data;
  } catch (error: any) {
    console.log("Error sorting games:", error.response?.data || error.message);
    return null;
  }
}

export async function searchGamesByName(value: string): Promise<Game[] | null> {
  try {
    const { data } = await privateAxios.get<Game[]>(
      `/games/admin/search?name=${value}`
    );
    return data;
  } catch (error: any) {
    console.log(
      `Error searching game by name ${value}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function createGame(newGame: FormData): Promise<Game | null> {
  try {
    const { data } = await privateAxios.post<Game>("/games", newGame, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error: any) {
    console.log(
      `Error creating game ${JSON.stringify(newGame)}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function editGame(
  newGame: FormData,
  gameId: string
): Promise<Game | null> {
  try {
    const { data } = await privateAxios.put<Game>(`/games/${gameId}`, newGame, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error: any) {
    console.log(
      `Error updating game ${JSON.stringify(newGame)}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function addGameServer(gameId: string, servers: string[]) {
  try {
    const { data } = await privateAxios.put(`/games/${gameId}/servers`, {
      servers,
    });
    return data;
  } catch (error: any) {
    console.log(
      `Error adding servers to game ${gameId}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function addGamePlatform(gameId: string, platforms: string[]) {
  try {
    const { data } = await privateAxios.put(`/games/${gameId}/platforms`, {
      platforms,
    });
    return data;
  } catch (error: any) {
    console.log(
      `Error adding platforms to game ${gameId}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function addGameRegion(gameId: string, regions: string[]) {
  try {
    const { data } = await privateAxios.put(`/games/${gameId}/regions`, {
      regions,
    });
    return data;
  } catch (error: any) {
    console.log(
      `Error adding regions to game ${gameId}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function deleteGameRegion(gameId: string, region: string) {
  try {
    const { data } = await privateAxios.delete(
      `/games/${gameId}/regions/${region}`
    );
    return data;
  } catch (error: any) {
    console.log(
      `Error deleting region from game ${gameId}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function deleteGamePlatform(gameId: string, platform: string) {
  try {
    const { data } = await privateAxios.delete(
      `/games/${gameId}/platforms/${platform}`
    );
    return data;
  } catch (error: any) {
    console.log(
      `Error deleting platform from game ${gameId}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function deleteGameServer(gameId: string, server: string) {
  try {
    const { data } = await privateAxios.delete(
      `/games/${gameId}/servers/${server}`
    );
    return data;
  } catch (error: any) {
    console.log(
      `Error deleting server from game ${gameId}:`,
      error.response?.data || error.message
    );
    return null;
  }
}
