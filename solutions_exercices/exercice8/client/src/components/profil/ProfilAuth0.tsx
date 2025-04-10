import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Card, Col, Row, Spinner } from "react-bootstrap";

export function ProfilAuth0() {
  const { user, getAccessTokenSilently, isLoading } = useAuth0();
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    async function obtenirAccessToken() {
      if (!user) {
        return;
      }
      setAccessToken(await getAccessTokenSilently());
    }

    obtenirAccessToken();
  }, [user, getAccessTokenSilently]);

  let contenu = (
    <Card.Body>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Chargement...</span>
      </Spinner>
    </Card.Body>
  );

  if (!isLoading) {
    contenu = (
      <Row className="">
        <Col md={3}>
          <Card.Img src={user?.picture} alt="Profil" />
        </Col>
        <Col md={9}>
          <Card.Body>
            <Card.Title>ID token décodé :</Card.Title>
            <Card.Text className="text-pre-wrap">
              {JSON.stringify(user, null, 2)}
            </Card.Text>
          </Card.Body>
          <Card.Body>
            <Card.Title>Access token :</Card.Title>
            <Card.Text>{accessToken}</Card.Text>
          </Card.Body>
        </Col>
      </Row>
    );
  }

  return (
    <Card>
      <Card.Header className="text-center" as="h3">
        Données d'Auth0 de <strong>{user?.email}</strong>
      </Card.Header>
      {contenu}
    </Card>
  );
}
