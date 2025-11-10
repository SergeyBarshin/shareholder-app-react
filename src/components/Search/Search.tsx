import { Form, InputGroup } from "react-bootstrap";
import searchIcon from "../../assets/search.svg";

interface SearchProps {
  query: string; // Значение из Redux.searchInput
  onQueryChange: (query: string) => void; // Redux action (setSearchInput)
  onSearch: () => void; // Redux action (applySearch)
}

export default function Search({
  query,
  onQueryChange,
  onSearch,
}: SearchProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(); // Вызываем Redux action applySearch
  };

  return (
    <Form
      onSubmit={handleSubmit}
      style={{ maxWidth: "540px" }}
      className="w-100 mx-auto"
    >
      {/* Убираем тень с родителя, чтобы она не была квадратной */}
      <InputGroup>
        {/* Добавляем класс для скругления левой части и тень */}
        <InputGroup.Text
          className="rounded-start-pill shadow-sm"
          style={{
            backgroundColor: "white",
            borderRight: "none",
            // Убираем рамку, чтобы тень была единой
            border: "1px solid #dee2e6",
          }}
        >
          <img src={searchIcon} alt="Поиск" style={{ width: "20px" }} />
        </InputGroup.Text>

        {/* Добавляем класс для скругления правой части и тень */}
        <Form.Control
          className="ps-0 rounded-end-pill shadow-sm"
          style={{
            borderLeft: "none",
            height: "48px",
            fontSize: "16px",
            // Убираем стандартную тень при фокусе, чтобы не было конфликтов
            boxShadow: "none",
          }}
          type="text"
          placeholder="Поиск акционера..."
          aria-label="Поиск акционера"
          value={query} // Связано с Redux.searchInput
          onChange={(e) => onQueryChange(e.target.value)} // Обновляет Redux.searchInput
        />
        {/* <Button type="submit" variant="danger" className="rounded-end-pill">Найти</Button> */}
        {/* При нажатии Enter в поле ввода вызывается handleSubmit, который вызывает onSearch/applySearch */}
      </InputGroup>
    </Form>
  );
}
