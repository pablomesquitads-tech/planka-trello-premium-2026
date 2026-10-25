/*!
 * Copyright (c) 2026 Trelle Software GmbH
 * Licensed under the Fair Use License
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Header, Icon, Message } from 'semantic-ui-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Trelle UI ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      /* empty */
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#1c2128',
            color: '#ffffff',
            padding: '24px',
          }}
        >
          <Container textAlign="center" style={{ maxWidth: '600px' }}>
            <Header as="h1" inverted icon>
              <Icon name="lightning" color="yellow" />
              Trelle Premium 2026
              <Header.Subheader style={{ color: '#adbac7', marginTop: '12px' }}>
                Ocorreu uma pequena instabilidade na renderização da interface.
              </Header.Subheader>
            </Header>
            <Message
              warning
              style={{ textAlign: 'left', margin: '24px 0', borderRadius: '8px' }}
            >
              <Message.Header>Detalhes do Erro</Message.Header>
              <p style={{ fontFamily: 'monospace', fontSize: '13px', margin: '8px 0 0' }}>
                {this.state.error?.message || 'Erro inesperado na aplicação'}
              </p>
            </Message>
            <Button.Group size="large">
              <Button primary onClick={this.handleReload} icon labelPosition="left">
                <Icon name="refresh" />
                Recarregar Página
              </Button>
              <Button.Or text="ou" />
              <Button basic inverted onClick={this.handleReset} icon labelPosition="right">
                Restaurar Dados Padrão
                <Icon name="trash alternate outline" />
              </Button>
            </Button.Group>
          </Container>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
