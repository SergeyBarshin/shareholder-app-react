export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SHAREHOLDERS: "/shareholders",
  SHAREHOLDER: "/shareholder/:id",
  MODERATOR: "/moderator",
};

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  HOME: "Главная",
  LOGIN: "Логин",
  SHAREHOLDERS: "Акционеры",
  SHAREHOLDER: "Акционер",
  MODERATOR: "Модерация",
};
