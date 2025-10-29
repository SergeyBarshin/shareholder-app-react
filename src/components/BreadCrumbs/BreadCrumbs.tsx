import { Breadcrumb } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap"; // Нужна доп. установка
import { type FC } from "react";
import { ROUTES } from "../../Routes";

interface ICrumb {
  label: string;
  path?: string;
}

interface BreadCrumbsProps {
  crumbs: ICrumb[];
}

export const BreadCrumbs: FC<BreadCrumbsProps> = ({ crumbs }) => {
  return (
    <Breadcrumb>
      <LinkContainer to={ROUTES.HOME}>
        <Breadcrumb.Item>Главная</Breadcrumb.Item>
      </LinkContainer>
      {crumbs.map((crumb, index) =>
        crumb.path && index < crumbs.length - 1 ? (
          <LinkContainer key={index} to={crumb.path}>
            <Breadcrumb.Item>{crumb.label}</Breadcrumb.Item>
          </LinkContainer>
        ) : (
          <Breadcrumb.Item key={index} active>
            {crumb.label}
          </Breadcrumb.Item>
        )
      )}
    </Breadcrumb>
  );
};
