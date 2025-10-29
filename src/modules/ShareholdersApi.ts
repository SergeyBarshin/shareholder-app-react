import type { Shareholder } from "./ShareholdersTypes";
import { SHAREHOLDERS_MOCK } from "./mock";

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
    const url = `/api/v1/shareholders?${params.toString()}`;

    const res = await fetch(url, { headers: { Accept: "application/json" } });

    // Если ответ не успешный (например, 500 ошибка от прокси), генерируем ошибку
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
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
    const res = await fetch(`/api/v1/shareholders/${id}`, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(
      `API request for GET shareholder ID:${id} failed, falling back to mock data:`,
      err
    );
    // При любой ошибке ищем в мок-данных
    return SHAREHOLDERS_MOCK.find((s) => s.id === id) || null;
  }
}
