import React from "react";
import { Redirect } from "react-router-dom";

export default class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.state = { cookiesCleared: false };
  }
  componentDidMount() {
    fetch("/logout").then(() => this.setState({ cookiesCleared: true }));
  }
  render() {
    const { cookiesCleared } = this.state;
    return (
      <>
        <div>Logging out...</div>
        {cookiesCleared && <Redirect to="/" />}
      </>
    );
  }
}
