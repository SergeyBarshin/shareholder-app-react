import type { Shareholder } from "./ShareholdersTypes";
import { SHAREHOLDERS_MOCK } from "./mock";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export interface CartStatus {
  draft_id: number;
  count: number;
}

const IS_TAURI =
  typeof window !== "undefined" &&
  typeof (window as any).__TAURI_INTERNALS__ !== "undefined";

const MINIO_BASE_URL =
  IS_TAURI && !import.meta.env.DEV ? "http://192.168.105.1:9000" : "";

// Типы для новых API, которые теперь экспортируются
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

// --- ИСПРАВЛЕННЫЙ HELPER ДЛЯ ЗАГОЛОВКОВ ---
const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  const token = localStorage.getItem("authToken");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};
// -------------------------------------------

// Функции listShareholders, getShareholder, getCartStatus остаются без изменений
export async function listShareholders(
  nameFilter?: string
): Promise<Shareholder[]> {
  try {
    const params = new URLSearchParams();
    if (nameFilter) {
      params.append("name", nameFilter);
    }

    const url = `${API_BASE_URL}/api/v1/shareholders?${params.toString()}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

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
    return nameFilter
      ? SHAREHOLDERS_MOCK.filter((s) =>
          s.name.toLowerCase().includes(nameFilter.toLowerCase())
        )
      : SHAREHOLDERS_MOCK;
  }
}

export async function getShareholder(id: number): Promise<Shareholder | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/shareholders/${id}`, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: Shareholder = await res.json();

    if (MINIO_BASE_URL && data.image_url) {
      data.image_url = MINIO_BASE_URL + data.image_url;
    }

    return data;
  } catch (err) {
    console.warn(
      `API request for GET shareholder ID:${id} failed, falling back to mock data:`,
      err
    );
    return SHAREHOLDERS_MOCK.find((s) => s.id === id) || null;
  }
}

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
      return initialStatus;
    }

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    // В Go API поля с большой буквы
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
    return initialStatus;
  }
}

// --- НОВЫЕ ФУНКЦИИ С ИСПРАВЛЕННЫМ ВЫЗОВОМ getAuthHeaders ---

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
        headers: getAuthHeaders(), // Теперь здесь все корректно
      }
    );
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        console.error("Unauthorized. Please log in as a moderator.");
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error("API request for listCalculations failed:", err);
    return [];
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
          ...getAuthHeaders(), // Здесь тоже все корректно
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!res.ok) {
      const errorBody = await res
        .json()
        .catch(() => ({ error: `HTTP error! status: ${res.status}` }));
      throw new Error(errorBody.error || `HTTP error! status: ${res.status}`);
    }
  } catch (err) {
    console.error(
      `API request for moderateCalculation failed for id ${id}:`,
      err
    );
    throw err;
  }
}

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

/**
 * Отправляет запрос на вход в систему.
 * @param credentials - Логин и пароль.
 * @returns - JWT токен.
 */
export async function loginUser(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ error: "Login failed" }));
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("API request for loginUser failed:", err);
    throw err; // Пробрасываем ошибку для обработки в компоненте
  }
}
