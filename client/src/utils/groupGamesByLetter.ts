import { Game } from "@/types/game.type";

export const groupedGames = (games: Game[]): Record<string, Game[]> => {
  const grouped = games.reduce((acc, game) => {
    const firstLetter = game.name.trim()[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(game);
    return acc;
  }, {} as Record<string, Game[]>);

  const sortedKeys = Object.keys(grouped).sort();

  const sortedGrouped: Record<string, Game[]> = {};
  sortedKeys.forEach((key) => {
    grouped[key].sort((a, b) => a.name.localeCompare(b.name));
    sortedGrouped[key] = grouped[key];
  });

  return sortedGrouped;
};

export const parseGroupedGamesToOptions = (
  groupedGames: Record<string, Game[]>
) => {
  const options: {
    label: string;
    value: string;
    regions: { label: string; value: string }[];
    servers: { label: string; value: string }[];
    platforms: { label: string; value: string }[];
  }[] = [];

  Object.keys(groupedGames).forEach((letter) => {
    const games = groupedGames[letter];

    games.forEach((game) => {
      const regionsSet = new Set<string>(game.region);
      const serversSet = new Set<string>(game.servers);
      const platformsSet = new Set<string>(game.platforms);

      options.push({
        label: game.name,
        value: game.id,
        regions: Array.from(regionsSet).map((item) => ({
          label: item,
          value: item,
        })),
        servers: Array.from(serversSet).map((item) => ({
          label: item,
          value: item,
        })),
        platforms: Array.from(platformsSet).map((item) => ({
          label: item,
          value: item,
        })),
      });
    });
  });

  return { options };
};
