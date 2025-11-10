import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import { Container, Spinner, Alert, Row, Col } from "react-bootstrap";
import { BreadCrumbs } from "../components/BreadCrumbs/BreadCrumbs";
import { ROUTE_LABELS } from "../Routes";
import { listShareholders, getCartStatus } from "../modules/ShareholdersApi";
import type { Shareholder } from "../modules/ShareholdersTypes";
import Search from "../components/Search/Search";
import ShareholdersList from "../components/ShareholdersList/ShareholdersList";
import FloatingCartIcon from "../components/FloatingCartIcon/FloatingCartIcon";
import type { CartStatus } from "../modules/ShareholdersApi"; // Импортируем CartStatus

// ИЗМЕНЕНИЕ: Используем новые имена полей draft_id и count
const initialCartStatus: CartStatus = {
  draft_id: -1,
  count: 0,
};

export default function ShareholdersPage() {
  const [shareholders, setShareholders] = useState<Shareholder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Добавляем состояние для корзины
  const [cartStatus, setCartStatus] = useState<CartStatus>(initialCartStatus);

  const fetchShareholders = async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listShareholders(query);
      setShareholders(data);
      if (data.length === 0 && query) {
        setError(`Акционеры по запросу "${query}" не найдены.`);
      }
    } catch (err) {
      setError(
        "Не удалось загрузить данные. Отображаются данные по умолчанию."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCartStatus = async () => {
    try {
      const status = await getCartStatus();
      setCartStatus(status);
    } catch (e) {
      // При ошибке или 401 API-функция сама вернет неактивный статус,
      // поэтому просто сбрасываем состояние на всякий случай.
      setCartStatus(initialCartStatus);
    }
  };

  useEffect(() => {
    fetchShareholders();
    fetchCartStatus(); // Загружаем статус корзины при монтировании
  }, []);

  const handleSearch = () => {
    fetchShareholders(searchQuery);
  };

  return (
    // Используем светло-серый фон
    <div style={{ backgroundColor: "#f7f8fa", minHeight: "100vh" }}>
      <Header />
      <Container className="py-4 py-md-5">
        <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.SHAREHOLDERS }]} />

        {/* pb-4 - отступ снизу */}
        <h1 className="display-4 text-center mb-4 mt-4 fw-bold">Акционеры</h1>

        {/* mb-5 - большой отступ снизу */}
        <Row className="justify-content-center mb-5">
          <Col md={8} lg={6}>
            <Search
              query={searchQuery}
              onQueryChange={setSearchQuery}
              onSearch={handleSearch}
            />
          </Col>
        </Row>

        {loading ? (
          <div className="text-center py-5">
            <Spinner
              animation="border"
              variant="danger"
              style={{ width: "3rem", height: "3rem" }}
            />
          </div>
        ) : (
          <>
            {error && shareholders.length === 0 && (
              <Alert variant="secondary" className="text-center">
                {error}
              </Alert>
            )}
            <ShareholdersList shareholders={shareholders} />
          </>
        )}
      </Container>
      {/* Добавляем плавающую иконку корзины */}
      <FloatingCartIcon status={cartStatus} />
    </div>
  );
}
