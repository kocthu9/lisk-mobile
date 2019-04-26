import React from 'react';
import { Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { translate } from 'react-i18next';
import { removePassphraseFromKeyChain } from '../../../utilities/passphrase';
import { IconButton } from '../../toolBox/button';
import { colors, themes } from '../../../constants/styleGuide';
import withTheme from '../../withTheme';
import getStyles from './styles';

class SignOutButton extends React.Component {
  onConfirm = () => {
    // clean active account
    this.props.signOut();
    removePassphraseFromKeyChain();

    // navigate to the signIn page
    this.props.navigation
      .dispatch(NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({
          routeName: 'SignIn',
          params: {
            signOut: true,
          },
        })],
      }));
  }

  onClick = () => {
    const { settings, t } = this.props;
    let message;

    if (settings.hasStoredPassphrase) {
      message = t(`You can sign back in using your passphrase and enable ${settings.sensorType} at any time.`);
    }

    Alert.alert(t('Are you sure?'), message, [
      {
        text: t('Cancel'),
        style: 'cancel',
      },
      {
        text: t('Confirm'),
        onPress: this.onConfirm,
      },
    ], { cancelable: false });
  }

  render() {
    const { theme, styles, t } = this.props;

    return (
      <IconButton
        icon='logout'
        iconSize={16}
        title={t('Sign out')}
        color={theme === themes.light ? colors.light.ultramarineBlue : colors.dark.blue}
        onClick={this.onClick}
        titleStyle={[styles.title, styles.theme.title]}
        style={styles.button}
      />
    );
  }
}

export default withTheme(translate()(SignOutButton), getStyles());
