import { type Shareholder } from "./ShareholdersTypes";

export const SHAREHOLDERS_MOCK: Shareholder[] = [
  {
    id: 1,
    name: "Иванов Иван Иванович",
    description: "Основатель компании, владеет контрольным пакетом акций.",
    share: 51.0,
    image_url: "/images/rip/ivanov.png",
  },
  {
    id: 2,
    name: "Петрова Мария Сергеевна",
    description: "Инвестор на ранней стадии, эксперт в области финансов.",
    share: 25.5,
    image_url: "/images/rip/petrova.png",
  },
  {
    id: 3,
    name: "Сидоров Алексей Петрович",
    description: "Технический директор и ключевой разработчик.",
    share: 13.5,
    image_url: null,
  },
];
