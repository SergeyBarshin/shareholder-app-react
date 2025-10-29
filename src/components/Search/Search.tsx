import { Form, InputGroup } from "react-bootstrap";
import searchIcon from "../../assets/search.svg"; // Положите иконку поиска в src/assets

interface SearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
}

export default function Search({
  query,
  onQueryChange,
  onSearch,
}: SearchProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <Form
      onSubmit={handleSubmit}
      style={{ maxWidth: "540px" }}
      className="w-100 mx-auto"
    >
      <InputGroup className="shadow-sm">
        <InputGroup.Text
          style={{ backgroundColor: "white", borderRight: "none" }}
        >
          <img src={searchIcon} alt="Поиск" style={{ width: "20px" }} />
        </InputGroup.Text>
        <Form.Control
          style={{
            borderLeft: "none",
            borderRadius: "0 24px 24px 0", // Скругление как в вашем дизайне
            height: "48px",
            fontSize: "16px",
          }}
          className="ps-0"
          type="text"
          placeholder="Поиск акционера..."
          aria-label="Поиск акционера"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </InputGroup>
    </Form>
  );
}
