import { Container, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap"; // Нужен для Nav.Link
import { ROUTES } from "../../Routes";
import alfaLogo from "../../assets/logo1.svg";

export default function Header() {
  return (
    // Белый хедер с тенью, как на сайте
    <Navbar bg="white" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to={ROUTES.HOME}>
          {" "}
          {/* Изменено: ссылка на HOME */}
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
            {/* --- ДОБАВЬТЕ ЭТУ ССЫЛКУ --- */}
            <LinkContainer to={ROUTES.MODERATOR}>
              <Nav.Link>Модерация</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
