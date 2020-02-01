import * as React from 'react';

import { getUserInfo } from 'utils/FirebaseUtils';

const Context = React.createContext();

const { Provider, Consumer: LoginConsumer } = Context;

class LoginProvider extends React.Component
{
  constructor (props)
  {
    super(props);
    this.state = {
      user: { phoneNumber: '0102376555' },
      userProfile: {
        type: undefined,
        obAccessToken: undefined,
        obRefreshToken: undefined,
        obAccTokenExpDate: undefined,
        obAccTokenDiscDate: undefined,
        obUserSeqNo: undefined
      },
      firmInfo: {
        equipment: undefined,
        modelYear: undefined
      }
    };

    this.actions = {
      setUser: loginUser =>
      {
        this.setState({ user: loginUser });
      },
      setUserType: loginUserType =>
      {
        this.setState({
          ...this.state,
          userProfile: { ...this.state.userProfile, type: loginUserType }
        });
      },
      setOBInfo: (
        obAccessToken,
        obRefreshToken,
        obAccTokenExpDate,
        obAccTokenDiscDate,
        obUserSeqNo
      ) =>
      {
        this.setState({
          ...this.state,
          userProfile: {
            ...this.state.userProfile,
            obAccessToken,
            obRefreshToken,
            obAccTokenExpDate,
            obAccTokenDiscDate,
            obUserSeqNo
          }
        });
      },
      setFirmInfo: (equipment, modelYear) =>
      {
        this.setState({
          ...this.state,
          firmInfo: {
            ...this.state.firmInfo,
            equipment,
            modelYear
          }
        });
      },
      refreshUserOBInfo: () =>
      {
        const { user } = this.state;
        getUserInfo(user.uid).then(data =>
        {
          const refreshUserInfo = data.val();
          this.setState({
            ...this.state,
            userProfile: {
              ...this.state.userProfile,
              obAccessToken: refreshUserInfo.obAccessToken,
              obRefreshToken: refreshUserInfo.obRefreshToken,
              obAccTokenExpDate: refreshUserInfo.obAccTokenExpDate,
              obAccTokenDiscDate: refreshUserInfo.obAccTokenDiscDate,
              obUserSeqNo: refreshUserInfo.obUserSeqNo
            }
          });
        });
      }
    };
  }

  render ()
  {
    const { children } = this.props;
    const { state, actions } = this;
    const value = { state, actions };
    return <Provider value={value}>{children}</Provider>;
  }
}

function withLogin (WrappedComponent)
{
  return function WithLogin (props)
  {
    return (
      <LoginConsumer>
        {/* {({ state, actions }) => ( */}
        <WrappedComponent
          // user={state.user}
          // userProfile={state.userProfile}
          // firmInfo={state.firmInfo}
          // setUser={actions.setUser}
          // setUserType={actions.setUserType}
          // setOBInfo={actions.setOBInfo}
          // setFirmInfo={actions.setFirmInfo}
          // refreshUserOBInfo={actions.refreshUserOBInfo}
          {...props}
        />
        {/* )} */}
      </LoginConsumer>
    );
  };
}

export { LoginProvider, LoginConsumer, withLogin };
