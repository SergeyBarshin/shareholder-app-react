import { Link } from "react-router-dom";
import { ROUTES } from "../Routes";
import Header from "../components/Header/Header";
import { Button, Container } from "react-bootstrap";

export default function HomePage() {
  const bannerStyle = {
    minHeight: "calc(100vh - 60px)",
    color: "black",
    backgroundColor: "#fff", // Чистый белый фон
    display: "flex",
    alignItems: "center",
  };

  return (
    <>
      <Header />
      <div style={bannerStyle}>
        <Container>
          <h1 className="display-3 fw-bold">Система расчета дивидендов</h1>
          <p className="lead my-4 text-muted">
            Удобный инструмент для учета акционеров и автоматизированного
            расчета дивидендов.
          </p>
          <Button as={Link} to={ROUTES.SHAREHOLDERS} variant="danger" size="lg">
            Перейти к списку акционеров
          </Button>
        </Container>
      </div>
    </>
  );
}
