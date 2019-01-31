import React from 'react';

const Context = React.createContext();

const { Provider, Consumer: LoginConsumer } = Context;

class LoginProvider extends React.Component {
  state = {
    user: undefined,
    type: undefined,
  };

  actions = {
    setUser: (loginUser) => {
      this.setState({ user: loginUser });
    },
    setUserType: (loginUserType) => {
      this.setState({ type: loginUserType });
    },
  };

  render() {
    const { children } = this.props;
    const { state, actions } = this;
    const value = { state, actions };
    return <Provider value={value}>{children}</Provider>;
  }
}

function withLogin(WrappedComponent) {
  return function WithLogin(props) {
    return (
      <LoginConsumer>
        {({ state, actions }) => (
          <WrappedComponent
            user={state.user}
            setUser={actions.setUser}
            setUserType={actions.setUserType}
            {...props}
          />
        )}
      </LoginConsumer>
    );
  };
}

export { LoginProvider, LoginConsumer, withLogin };
