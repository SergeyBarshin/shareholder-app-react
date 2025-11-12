import type { Shareholder } from "./ShareholdersTypes";
import { SHAREHOLDERS_MOCK } from "./mock";

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
const API_BASE_URL =
  IS_TAURI && !import.meta.env.DEV ? "http://192.168.105.1:8080" : "";

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
