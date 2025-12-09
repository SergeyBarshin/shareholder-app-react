import { useEffect, useState, useMemo } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Row,
  Col,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import Header from "../components/Header/Header";
import {
  listCalculations,
  moderateCalculation,
} from "../modules/ShareholdersApi";
import type {
  Calculation,
  CalculationListParams,
} from "../modules/ShareholdersApi";
import { BreadCrumbs } from "../components/BreadCrumbs/BreadCrumbs";
import { ROUTE_LABELS } from "../Routes";

export default function ModeratorPage() {
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Состояние для фильтров, которые отправляются на бэкенд
  const [filters, setFilters] = useState<CalculationListParams>({
    status: "",
    from_date: "",
    to_date: "",
  });

  // Состояние для фильтра по создателю (на фронтенде)
  const [creatorFilter, setCreatorFilter] = useState("");

  // --- Функция для загрузки данных ---
  const fetchCalculations = async () => {
    setError(null);
    try {
      const data = await listCalculations(filters);
      setCalculations(data);
    } catch (err) {
      setError(
        "Ошибка загрузки данных. Проверьте авторизацию и соединение с сервером."
      );
    } finally {
      // Убираем спиннер только при первой загрузке
      if (loading) setLoading(false);
    }
  };

  // --- Short Polling ---
  useEffect(() => {
    // Загружаем данные сразу при изменении фильтров
    fetchCalculations();

    // Устанавливаем интервал для периодического обновления
    const intervalId = setInterval(fetchCalculations, 5000); // каждые 5 секунд

    // Очищаем интервал при размонтировании компонента или смене фильтров
    return () => clearInterval(intervalId);
  }, [filters]); // Эффект перезапустится при изменении фильтров

  // --- Обработчики ---
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleModerate = async (
    id: number,
    status: "completed" | "rejected"
  ) => {
    try {
      await moderateCalculation(id, status);
      // Сразу после успешной модерации, запрашиваем обновленные данные,
      // чтобы не ждать следующего тика интервала
      fetchCalculations();
    } catch (err) {
      alert(`Не удалось изменить статус заявки: ${err}`);
    }
  };

  // --- Фильтрация на фронтенде по создателю ---
  const filteredByCreator = useMemo(() => {
    if (!creatorFilter) {
      return calculations;
    }
    return calculations.filter((c) =>
      c.creator.login.toLowerCase().includes(creatorFilter.toLowerCase())
    );
  }, [calculations, creatorFilter]);

  // --- Рендеринг ---
  return (
    <div style={{ backgroundColor: "#f7f8fa", minHeight: "100vh" }}>
      <Header />
      <Container className="py-4">
        <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.MODERATOR }]} />
        <h1 className="mt-4">Панель модератора</h1>

        {/* Блок с фильтрами */}
        <Row className="g-3 my-4 p-3 bg-white rounded shadow-sm">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Статус</Form.Label>
              <Form.Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">Все</option>
                <option value="submitted">Сформирован</option>
                <option value="completed">Завершен</option>
                <option value="rejected">Отклонен</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Дата формирования (от)</Form.Label>
              <Form.Control
                type="date"
                name="from_date"
                value={filters.from_date}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Дата формирования (до)</Form.Label>
              <Form.Control
                type="date"
                name="to_date"
                value={filters.to_date}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Создатель (логин)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Фильтр по создателю..."
                value={creatorFilter}
                onChange={(e) => setCreatorFilter(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Отображение данных */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="danger" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Статус</th>
                <th>Создатель</th>
                <th>Дата подачи</th>
                <th>Результат</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredByCreator.length > 0 ? (
                filteredByCreator.map((calc) => (
                  <tr key={calc.id}>
                    <td>{calc.id}</td>
                    <td>
                      <Badge
                        bg={
                          calc.status === "completed"
                            ? "success"
                            : calc.status === "rejected"
                            ? "danger"
                            : "secondary"
                        }
                      >
                        {calc.status}
                      </Badge>
                    </td>
                    <td>{calc.creator.login}</td>
                    <td>
                      {calc.submitted_at
                        ? new Date(calc.submitted_at).toLocaleString()
                        : "—"}
                    </td>
                    <td>
                      {/* Здесь можно будет отображать `completed_items_count` */}
                      <Badge bg="info">{calc.completed_items_count}</Badge>
                    </td>
                    <td>
                      {calc.status === "submitted" && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            className="me-2"
                            onClick={() => handleModerate(calc.id, "completed")}
                          >
                            Завершить
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleModerate(calc.id, "rejected")}
                          >
                            Отклонить
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
                    Заявки, соответствующие фильтрам, не найдены.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Container>
    </div>
  );
}
