import type { Shareholder } from "./ShareholdersTypes";
import { SHAREHOLDERS_MOCK } from "./mock";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface CartStatus {
  draft_id: number; // Обновлено на draft_id, как в API
  count: number; // Обновлено на count, как в API
}

// Определяем, запущено ли приложение в среде Tauri (Webview)
const IS_TAURI =
  typeof window !== "undefined" &&
  typeof (window as any).__TAURI_INTERNALS__ !== "undefined";

// Определяем базовый URL для API:
// 1. В собранном (Production) Tauri-приложении используем прямой IP (требование задания).
// 2. Во всех остальных случаях (Web Dev/Prod, Tauri Dev) используем относительный путь (""),
//    который в Dev-режиме перенаправляется через Vite Proxy.
//const API_BASE_URL =
// IS_TAURI && !import.meta.env.DEV ? "http://192.168.105.1:8080" : "";

// URL для Minio. Используется абсолютный IP, так как это всегда внешнее подключение.
// Настройки CSP в tauri.conf.json должны разрешать этот адрес.
const MINIO_BASE_URL =
  IS_TAURI && !import.meta.env.DEV ? "http://192.168.105.1:9000" : "";

/**
 * Получает список всех акционеров.
 * Если бэкенд недоступен или возвращает ошибку, использует mock-данные.
 * @param nameFilter - Строка для фильтрации по имени на стороне бэкенда.
 */
export async function listShareholders(
  nameFilter?: string
): Promise<Shareholder[]> {
  try {
    const params = new URLSearchParams();
    if (nameFilter) {
      params.append("name", nameFilter);
    }

    // Используем API_BASE_URL, который будет "" в Dev-режиме (через Vite Proxy)
    // и абсолютный IP в Tauri Prod.
    const url = `${API_BASE_URL}/api/v1/shareholders?${params.toString()}`;

    const res = await fetch(url, { headers: { Accept: "application/json" } });

    // Если ответ не успешный (например, 500 ошибка от прокси), генерируем ошибку
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    // Если запрос успешен, возвращаем данные,
    // но сначала заменяем относительные пути к картинкам Minio
    const data: Shareholder[] = await res.json();

    if (MINIO_BASE_URL) {
      return data.map((s) => ({
        ...s,
        image_url: s.image_url ? MINIO_BASE_URL + s.image_url : null,
      }));
    }

    return data;
  } catch (err) {
    console.warn(
      "API request for LIST failed, falling back to mock data:",
      err
    );
    // При любой ошибке возвращаем отфильтрованные мок-данные
    return nameFilter
      ? SHAREHOLDERS_MOCK.filter((s) =>
          s.name.toLowerCase().includes(nameFilter.toLowerCase())
        )
      : SHAREHOLDERS_MOCK;
  }
}

/**
 * Получает одного акционера по ID.
 * Если бэкенд недоступен или возвращает ошибку, использует mock-данные.
 * @param id - ID акционера.
 */
export async function getShareholder(id: number): Promise<Shareholder | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/shareholders/${id}`, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: Shareholder = await res.json();

    // Заменяем путь к картинке, если это необходимо
    if (MINIO_BASE_URL && data.image_url) {
      data.image_url = MINIO_BASE_URL + data.image_url;
    }

    return data;
  } catch (err) {
    console.warn(
      `API request for GET shareholder ID:${id} failed, falling back to mock data:`,
      err
    );
    // При любой ошибке ищем в мок-данных
    return SHAREHOLDERS_MOCK.find((s) => s.id === id) || null;
  }
}

/**
 * Получает текущий статус корзины/черновика.
 * При ошибке или 401 возвращает неактивный статус (draft_id: -1, count: 0).
 */
export async function getCartStatus(): Promise<CartStatus> {
  const initialStatus = { draft_id: -1, count: 0 };
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/v1/dividend-calculations/cart-status-mock`,
      {
        headers: { Accept: "application/json" },
      }
    );

    if (res.status === 401) {
      // Если не авторизован (гость), возвращаем неактивную корзину
      return initialStatus;
    }

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    // Обратите внимание: API возвращает DraftID и Count
    const data = (await res.json()) as { DraftID: number; Count: number };
    return {
      draft_id: data.DraftID,
      count: data.Count,
    };
  } catch (err) {
    console.warn(
      "API request for GET cart status failed, falling back to mock data:",
      err
    );
    // При любой другой ошибке (нет связи и т.д.) возвращаем неактивный статус
    return initialStatus;
  }
}

// Helper для получения заголовков авторизации
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken"); // Предполагаем, что токен хранится здесь после логина
  if (!token) return { Accept: "application/json" };
  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Типы для новых API
export interface Calculation {
  id: number;
  status: string;
  total_profit: number | null;
  created_at: string;
  submitted_at: string | null;
  completed_at: string | null;
  creator: { id: number; login: string; is_moderator: boolean };
  moderator: { id: number; login: string; is_moderator: boolean } | null;
  completed_items_count: number;
}

export interface CalculationListParams {
  status?: string;
  from_date?: string;
  to_date?: string;
}

/**
 * Получает список заявок для модератора с фильтрацией.
 */
export async function listCalculations(
  params: CalculationListParams
): Promise<Calculation[]> {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  if (params.from_date) query.append("from_date", params.from_date);
  if (params.to_date) query.append("to_date", params.to_date);

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/v1/dividend-calculations?${query.toString()}`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!res.ok) {
      // При ошибках авторизации или других проблемах вернем пустой массив
      if (res.status === 401 || res.status === 403) {
        console.error("Unauthorized. Please log in as a moderator.");
        // Можно добавить логику редиректа на страницу логина
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error("API request for listCalculations failed:", err);
    return []; // При ошибке сети возвращаем пустой массив
  }
}

/**
 * Отправляет запрос на модерацию заявки (завершение или отклонение).
 */
export async function moderateCalculation(
  id: number,
  status: "completed" | "rejected"
): Promise<void> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/v1/dividend-calculations/${id}/moderate`,
      {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
  } catch (err) {
    console.error(
      `API request for moderateCalculation failed for id ${id}:`,
      err
    );
    throw err; // Пробрасываем ошибку, чтобы компонент мог ее обработать
  }
}
