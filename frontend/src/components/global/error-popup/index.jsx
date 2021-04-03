import React from 'react';
import { Container, Header, ErrorMessage } from './styles'

/**
 * HOW TO USE IT: use it as an enclosing tag (i.e. <ErrorPopup />)
 * ErrorPopup accepts props:
 *    @params
 *    title?         Title of popup (default "ERROR")
 *    description?   Description of popup (default "Sorry, ...")
 *    errorCode?     Error code (default no error code shown)
 *    errorMessage?  Error message (default no error shown)
 */

class ErrorPopup extends React.Component {
  render() {
    return (
      <Container>
        <Header>
          {this.props.title ? this.props.title : "ERROR"}
        </Header>
        <ErrorMessage>
          {this.props.description ? this.props.description : `Sorry, we could not complete your request. Please try again later and if the problem persists contact one of the administrators.`}
        </ErrorMessage>
        <ErrorMessage>
          {this.props.errorCode ? `Error Code: ${this.props.errorCode}` : ''}
        </ErrorMessage>
        <ErrorMessage>
          {this.props.errorMessage ? `Error Message: ${this.props.errorMessage}` : ''}
        </ErrorMessage>
      </Container>
    )
  }
}

export default ErrorPopup;