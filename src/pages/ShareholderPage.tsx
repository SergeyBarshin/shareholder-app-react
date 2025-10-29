import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Container, Row, Col, Image, Alert } from "react-bootstrap";
import Header from "../components/Header/Header";
import { BreadCrumbs } from "../components/BreadCrumbs/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { getShareholder } from "../modules/ShareholdersApi";
import type { Shareholder } from "../modules/ShareholdersTypes";
import defaultImage from "../assets/default-avatar.png";

export default function ShareholderPage() {
  const [shareholder, setShareholder] = useState<Shareholder | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  const [imageUrl, setImageUrl] = useState(defaultImage);
  const handleImageError = () => setImageUrl(defaultImage);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getShareholder(Number(id))
      .then((data) => {
        setShareholder(data);
        if (data?.image_url) {
          setImageUrl(data.image_url);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <Spinner animation="border" variant="danger" />
        </div>
      </>
    );
  }

  if (!shareholder) {
    return (
      <>
        <Header />
        <Container className="text-center py-5">
          <BreadCrumbs crumbs={[{ label: "Ошибка" }]} />
          <Alert variant="danger" className="mt-4">
            <Alert.Heading>Ошибка 404</Alert.Heading>
            <p>Акционер с таким ID не найден.</p>
          </Alert>
        </Container>
      </>
    );
  }

  return (
    // Глобальный фон из вашего CSS (--page-bg)
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <Header />
      <Container className="py-5">
        <BreadCrumbs
          crumbs={[
            { label: ROUTE_LABELS.SHAREHOLDERS, path: ROUTES.SHAREHOLDERS },
            { label: shareholder.name },
          ]}
        />
        {/*
          Используем Bootstrap Grid (Row, Col) для создания двухколоночной структуры.
          - `align-items-center` выравнивает колонки по центру по вертикали.
          - `gy-5` добавляет большой вертикальный отступ на мобильных устройствах.
        */}
        <Row className="align-items-center gy-5 mt-4">
          {/* Левая колонка с текстом */}
          <Col lg={7}>
            {/* display-4 - большой заголовок, fw-bold - жирный */}
            <h1 className="display-4 fw-bold">{shareholder.name}</h1>

            {/* lead - увеличивает текст, text-muted - серый цвет */}
            <p className="lead text-muted my-4">{shareholder.description}</p>

            {/* Красная линия-разделитель */}
            <hr
              style={{ borderColor: "#ef3124", borderWidth: "2px", opacity: 1 }}
            />

            <div className="d-flex justify-content-between align-items-center mt-4">
              {/* fs-5 - размер шрифта */}
              <span className="fs-5 text-muted">Доля в компании:</span>
              <span className="fs-4 fw-bold">{shareholder.share}%</span>
            </div>
          </Col>

          {/* Правая колонка с картинкой */}
          {/* order-lg-last - на больших экранах эта колонка будет последней */}
          {/* order-first - на мобильных (по умолчанию) она будет первой */}
          <Col lg={5} className="text-center order-first order-lg-last">
            <Image
              src={imageUrl}
              onError={handleImageError}
              alt={shareholder.name}
              fluid
              style={{ maxHeight: "300px", objectFit: "contain" }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
