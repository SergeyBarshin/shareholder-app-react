import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import { Container, Spinner, Alert, Row, Col } from "react-bootstrap";
import { BreadCrumbs } from "../components/BreadCrumbs/BreadCrumbs";
import { ROUTE_LABELS } from "../Routes";
import { listShareholders } from "../modules/ShareholdersApi";
import type { Shareholder } from "../modules/ShareholdersTypes";
import Search from "../components/Search/Search";
import ShareholdersList from "../components/ShareholdersList/ShareholdersList";

// --- НОВЫЕ ИМПОРТЫ REDUX ---
import { useSearchInput, useAppliedSearch } from "../slices/filterSlice";
import { useFilterData } from "../hooks/useFilterData";
// --------------------------

export default function ShareholdersPage() {
  const [shareholders, setShareholders] = useState<Shareholder[]>([]);

  // --- REDUX HOOKS ---
  const { setSearchInput, applySearch } = useFilterData();
  const searchInput = useSearchInput(); // для поля ввода
  const appliedSearch = useAppliedSearch(); // для API
  // --------------------

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Функция загрузки данных, принимает фильтр
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

  // 1. useEffect для загрузки данных при изменении примененного фильтра (appliedSearch)
  useEffect(() => {
    // Вызываем загрузку с примененным фильтром
    fetchShareholders(appliedSearch);
  }, [appliedSearch]);

  // 2. useEffect для синхронизации input с appliedSearch при первом рендере
  // Это гарантирует, что поле ввода корректно отобразит сохраненный фильтр
  useEffect(() => {
    // Устанавливаем в поле ввода значение последнего примененного фильтра
    if (searchInput !== appliedSearch) {
      setSearchInput(appliedSearch);
    }
  }, [appliedSearch]); // При изменении appliedSearch (например, при возврате на страницу)

  // Обработчик кнопки поиска
  const handleSearch = () => {
    applySearch(); // Это обновит appliedSearch в Redux, что триггернет useEffect[appliedSearch]
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
              query={searchInput} // В поле показываем то, что вводит пользователь
              onQueryChange={setSearchInput} // Обновляем Redux.searchInput
              onSearch={handleSearch} // Вызываем Redux.applySearch
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
    </div>
  );
}
