import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Routes";
import alfaLogo from "../../assets/logo1.svg";

export default function Header() {
  return (
    // Белый хедер с тенью, как на сайте
    <Navbar bg="white" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to={ROUTES.SHAREHOLDERS}>
          <img
            alt="Логотип"
            src={alfaLogo}
            height="30"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}
