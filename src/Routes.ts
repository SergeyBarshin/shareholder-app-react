export const ROUTES = {
  HOME: "/",
  SHAREHOLDERS: "/shareholders",
  SHAREHOLDER: "/shareholder/:id",
};

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  HOME: "Главная",
  SHAREHOLDERS: "Акционеры",
  SHAREHOLDER: "Акционер",
};
