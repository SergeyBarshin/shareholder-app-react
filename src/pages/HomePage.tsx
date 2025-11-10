import { Link } from "react-router-dom";
import { ROUTES } from "../Routes";
import Header from "../components/Header/Header";
import { Button, Container, Carousel } from "react-bootstrap"; // Импортируем Carousel

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
          {/* Заменяем статический контент на карусель */}
          <Carousel
            indicators={true}
            controls={true}
            interval={5000}
            className="shadow-lg rounded-4 overflow-hidden"
          >
            {/* Слайд 1: Основной призыв */}
            <Carousel.Item
              style={{ padding: "60px", backgroundColor: "#f7f8fa" }}
            >
              <div className="text-center py-5">
                <h1 className="display-4 fw-bold mb-3">
                  Система учета акционеров
                </h1>
                <p className="lead my-4 text-muted">
                  Удобный инструмент для учета акционеров и автоматизированного
                  расчета дивидендов.
                </p>
                <Button
                  as={Link}
                  to={ROUTES.SHAREHOLDERS}
                  variant="danger"
                  size="lg"
                  className="mt-3"
                >
                  Перейти к списку акционеров
                </Button>
              </div>
            </Carousel.Item>

            {/* Слайд 2: Дополнительная информация */}
            <Carousel.Item style={{ padding: "60px", backgroundColor: "#fff" }}>
              <div className="text-center py-5">
                <h1 className="display-4 fw-bold mb-3">Надежные данные</h1>
                <p className="lead my-4 text-muted">
                  Все данные получены напрямую из корпоративной базы, с
                  резервным доступом к mock-данным.
                </p>
                <Button
                  as={Link}
                  to={ROUTES.SHAREHOLDERS}
                  variant="outline-danger"
                  size="lg"
                  className="mt-3"
                >
                  Проверить список
                </Button>
              </div>
            </Carousel.Item>

            {/* Слайд 3: Особенности */}
            <Carousel.Item
              style={{ padding: "60px", backgroundColor: "#f7f8fa" }}
            >
              <div className="text-center py-5">
                <h1 className="display-4 fw-bold mb-3">Поиск и Фильтрация</h1>
                <p className="lead my-4 text-muted">
                  Используйте удобный поиск для быстрого нахождения нужного
                  акционера по имени.
                </p>
                <Button
                  as={Link}
                  to={ROUTES.SHAREHOLDERS}
                  variant="danger"
                  size="lg"
                  className="mt-3"
                >
                  Начать поиск
                </Button>
              </div>
            </Carousel.Item>
          </Carousel>
        </Container>
      </div>
    </>
  );
}
