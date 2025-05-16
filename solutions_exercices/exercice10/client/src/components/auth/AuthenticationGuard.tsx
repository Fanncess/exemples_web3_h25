import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Spinner } from "react-bootstrap";

type Props = {
  component: React.ComponentType;
};

export const AuthenticationGuard = ({ component }: Props) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Chargement...</span>
      </Spinner>
    ),
  });

  return <Component />;
};
