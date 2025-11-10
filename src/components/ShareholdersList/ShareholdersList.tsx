import { Row, Col } from "react-bootstrap";
import ShareholderCard from "../ShareholderCard/ShareholderCard";
import { type Shareholder } from "../../modules/ShareholdersTypes";

export default function ShareholdersList({
  shareholders,
}: {
  shareholders: Shareholder[];
}) {
  return (
    // g-4 - средние отступы, gy-5 - увеличенные вертикальные отступы для "парящих" карточек
    <Row xs={1} sm={2} lg={3} className="g-4 gy-5">
      {shareholders.map((s) => (
        <Col key={s.id} className="d-flex align-items-stretch py-3">
          <ShareholderCard shareholder={s} />
        </Col>
      ))}
    </Row>
  );
}
