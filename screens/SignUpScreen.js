import React from 'react';
import {
  StyleSheet, Text, TextInput, View, Button,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
  },
});

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errorMessage: null,
    };
  }

  handleSignUp = () => {
    // TODO: Firebase stuff...
    console.log('handleSignUp');
  };

  render() {
    const { errorMessage, email, password } = this.state;

    return (
      <View style={styles.container}>
        <Text>Sign Up</Text>
        {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={text => this.setState({ email: text })}
          value={email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={text => this.setState({ password: text })}
          value={password}
        />
        <Button title="Sign Up" onPress={this.handleSignUp} />
        <Button
          title="Already have an account? Login"
          onPress={() => this.props.navigation.navigate('Login')}
        />
      </View>
    );
  }
}
