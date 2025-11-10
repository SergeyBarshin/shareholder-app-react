import { Badge } from "react-bootstrap";
// ИЗМЕНЕНИЕ: Предполагаем, что новую иконку назвали moneyIcon.svg
import moneyIcon from "../../assets/cart1.svg"; // Новая иконка
import { Link } from "react-router-dom";
import type { CartStatus } from "../../modules/ShareholdersApi";

interface FloatingCartIconProps {
  status: CartStatus;
}

export default function FloatingCartIcon({ status }: FloatingCartIconProps) {
  // Активность определяется по draft_id > 0
  const isActive = status.draft_id > 0;
  const cartUrl = isActive ? `/dividend-calculation/${status.draft_id}` : "#";

  // --- ИЗМЕНЕННЫЕ СТИЛИ ДЛЯ СООТВЕТСТВИЯ КАРТИНКЕ ---
  const iconSize = "60px";
  const cartIconStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "30px",
    left: "30px",
    right: "auto",
    width: iconSize,
    height: iconSize,
    backgroundColor: "white", // Белый фон
    borderRadius: "12px", // Скругленные углы
    // Тень, чтобы имитировать "парящий" эффект
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.05)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1050,
    cursor: isActive ? "pointer" : "default",
    transition: "transform 0.2s ease-out",
    textDecoration: "none",
    // Делаем неактивную кнопку менее заметной
    opacity: isActive ? 1 : 0.7,
  };

  // Добавляем hover эффект для лучшего UX
  const buttonProps = isActive
    ? {
        onMouseEnter: (e: any) =>
          (e.currentTarget.style.transform = "scale(1.05)"),
        onMouseLeave: (e: any) =>
          (e.currentTarget.style.transform = "scale(1)"),
      }
    : {};

  const imgStyle: React.CSSProperties = {
    width: "48px", // Размер иконки внутри контейнера
    height: "48px",
    objectFit: "contain",
  };

  const badgeStyle: React.CSSProperties = {
    position: "absolute",
    top: "-5px", // Сдвигаем вверх
    right: "-5px", // Сдвигаем вправо
    fontSize: "12px",
    padding: "4px 8px",
    minWidth: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    borderRadius: "50%", // Делаем его круглым, как на референсе
  };
  // -------------------------------------------------------------------

  const content = (
    <>
      {/* ИЗМЕНЕНИЕ: Используем moneyIcon */}
      <img src={moneyIcon} alt="Расчет дивидендов" style={imgStyle} />

      {/* Счетчик отображается всегда */}
      <Badge
        pill
        // ИЗМЕНЕНИЕ: Используем bg="danger" для красного цвета
        bg="danger"
        text="white"
        style={badgeStyle}
      >
        {/*status.count*/ 0}
      </Badge>
    </>
  );

  // Используем Link, если активен, иначе - div
  const Component = isActive ? Link : "div";

  return (
    <Component
      to={cartUrl}
      style={cartIconStyle}
      aria-label="Перейти к расчету дивидендов"
      {...buttonProps} // Добавляем hover эффект
    >
      {content}
    </Component>
  );
}
