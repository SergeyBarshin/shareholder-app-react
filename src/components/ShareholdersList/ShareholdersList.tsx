// Удаляем импорты Row и Col
// import { Row, Col } from "react-bootstrap";
import ShareholderCard from "../ShareholderCard/ShareholderCard";
import { type Shareholder } from "../../modules/ShareholdersTypes";

// Импортируем новый CSS файл
import "./ShareholdersList.css";

export default function ShareholdersList({
  shareholders,
}: {
  shareholders: Shareholder[];
}) {
  return (
    // Заменяем Row/Col на div с классом grid-list
    <div className="grid-list">
      {shareholders.map((s) => (
        // Карточка теперь без Col, чтобы Grid сам управлял колонками
        <ShareholderCard key={s.id} shareholder={s} />
      ))}
    </div>
  );
}
