import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Shareholder } from "../../modules/ShareholdersTypes";
import defaultImage from "../../assets/default-avatar.png";

export default function ShareholderCard({
  shareholder,
}: {
  shareholder: Shareholder;
}) {
  const [imageUrl, setImageUrl] = useState(
    shareholder.image_url || defaultImage
  );

  useEffect(() => {
    setImageUrl(shareholder.image_url || defaultImage);
  }, [shareholder.image_url]);

  const handleImageError = () => setImageUrl(defaultImage);

  return (
    // Добавляем position: 'relative', чтобы аватар позиционировался относительно карточки
    <Card
      className="h-100 text-center border-0 shadow-sm pt-5 position-relative"
      style={{ borderRadius: "24px", marginTop: "60px" }}
    >
      <Card.Img
        src={imageUrl}
        onError={handleImageError}
        className="rounded-circle"
        style={{
          width: "120px",
          height: "120px",
          objectFit: "cover",
          border: "4px solid white",
          // --- ИЗМЕНЕНИЯ ЗДЕСЬ ---
          position: "absolute",
          top: 0, // Позиционируем относительно верха карточки
          left: "50%", // Сдвигаем левый край на 50% ширины родителя
          transform: "translate(-50%, -50%)", // Смещаем элемент на половину его собственной ширины/высоты
          zIndex: 2,
        }}
      />
      {/* pt-5 и pb-4 - отступы, чтобы контент не залезал под/на картинку */}
      <Card.Body className="d-flex flex-column pt-5 px-4 pb-4">
        <Card.Title as="h3" className="fs-5 fw-bold mb-1">
          {shareholder.name}
        </Card.Title>
        <Card.Text className="text-muted small flex-grow-1">
          {shareholder.description}
        </Card.Text>
        <div className="mt-3 mb-4">
          <small className="text-muted">Доля в компании</small>
          <p className="h5 fw-bold mb-0">{shareholder.share}%</p>
        </div>
        <div className="mt-auto">
          <div className="d-grid gap-2">
            <Button
              // @ts-ignore
              as={Link}
              to={`/shareholder/${shareholder.id}`}
              variant="danger"
              className="px-4"
            >
              Подробнее
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
