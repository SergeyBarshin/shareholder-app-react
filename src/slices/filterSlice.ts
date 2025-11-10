import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

interface FilterState {
  searchInput: string; // то, что пользователь вводит в поле
  appliedSearch: string; // то, что применено как фильтр (после нажатия кнопки/Enter)
}

const initialState: FilterState = {
  searchInput: "",
  appliedSearch: "",
};

const filtersSlice = createSlice({
  name: "shareholderFilters", // Название для вашего приложения
  initialState,
  reducers: {
    // Обновляет только поле ввода
    setSearchInput(state, { payload }) {
      state.searchInput = payload;
    },
    // Применяет фильтр
    applySearch(state) {
      state.appliedSearch = state.searchInput;
    },
  },
});

// Селектор для поля ввода
export const useSearchInput = () =>
  useSelector((state: any) => state.appState.filters.searchInput);

// Селектор для примененного фильтра
export const useAppliedSearch = () =>
  useSelector((state: any) => state.appState.filters.appliedSearch);

export const {
  setSearchInput: setSearchInputAction,
  applySearch: applySearchAction,
} = filtersSlice.actions;

export default filtersSlice.reducer;
