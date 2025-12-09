import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { loginUser } from "../modules/ShareholdersApi";
import { ROUTES } from "../Routes";
import { jwtDecode } from "jwt-decode"; // <-- НОВЫЙ ИМПОРТ

// Определим интерфейс для данных, которые мы ожидаем найти в токене
interface DecodedToken {
  is_moderator: boolean;
  // Здесь могут быть и другие поля, например, exp, user_id, но нам нужно только это
}

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const { token } = await loginUser({ login, password });

      // --- НАЧАЛО ИЗМЕНЕНИЙ ---
      // 1. Декодируем токен, чтобы получить роль
      const decodedToken = jwtDecode<DecodedToken>(token);

      // 2. Сохраняем и токен, и роль в localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("isModerator", String(decodedToken.is_moderator));
      // --- КОНЕЦ ИЗМЕНЕНИЙ ---

      // Перенаправляем на главную страницу, чтобы Header мог обновиться.
      // Пользователь сам выберет, куда ему идти.
      navigate(ROUTES.HOME);

      // Важно: перезагружаем страницу, чтобы Header "подхватил" новые данные из localStorage.
      // Это самый простой способ для лабы, в больших приложениях использовали бы Redux/Context.
      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Произошла неизвестная ошибка"
      );
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f7f8fa",
        minHeight: "100vh",
        paddingTop: "5rem",
      }}
    >
      <Container style={{ maxWidth: "400px" }}>
        <Card className="shadow-sm">
          <Card.Body className="p-4">
            <h2 className="text-center mb-4">Вход</h2>
            <Form onSubmit={handleSubmit}>
              {/* ... остальная часть формы не меняется ... */}
              <Form.Group className="mb-3" controlId="formLogin">
                <Form.Label>Логин</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Введите логин"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Пароль</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              {error && <Alert variant="danger">{error}</Alert>}

              <div className="d-grid">
                <Button variant="danger" type="submit">
                  Войти
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
