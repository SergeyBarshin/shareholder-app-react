import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { ROUTES } from "../../Routes";
import alfaLogo from "../../assets/logo1.svg";
import { useAuth } from "../../hooks/useAuth"; // <-- НОВЫЙ ИМПОРТ

export default function Header() {
  const { isAuthenticated, isModerator } = useAuth(); // <-- ИСПОЛЬЗУЕМ ХУК
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("isModerator");
    navigate(ROUTES.LOGIN);
    window.location.reload(); // Перезагружаем, чтобы все компоненты обновили свое состояние
  };

  return (
    <Navbar bg="white" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to={ROUTES.HOME}>
          <img
            alt="Логотип"
            src={alfaLogo}
            height="30"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to={ROUTES.HOME}>
              <Nav.Link>Главная</Nav.Link>
            </LinkContainer>
            <LinkContainer to={ROUTES.SHAREHOLDERS}>
              <Nav.Link>Акционеры</Nav.Link>
            </LinkContainer>

            {/* --- НАЧАЛО ИЗМЕНЕНИЙ --- */}
            {/* Показываем вкладку только если пользователь - модератор */}
            {isModerator && (
              <LinkContainer to={ROUTES.MODERATOR}>
                <Nav.Link>Модерация</Nav.Link>
              </LinkContainer>
            )}
            {/* --- КОНЕЦ ИЗМЕНЕНИЙ --- */}
          </Nav>

          {/* --- ДОБАВЛЯЕМ КНОПКИ ВХОДА/ВЫХОДА --- */}
          <Nav>
            {isAuthenticated ? (
              <Button variant="outline-danger" onClick={handleLogout}>
                Выйти
              </Button>
            ) : (
              <LinkContainer to={ROUTES.LOGIN}>
                <Nav.Link as={Button} variant="danger">
                  Войти
                </Nav.Link>
              </LinkContainer>
            )}
          </Nav>
          {/* ------------------------------------ */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
