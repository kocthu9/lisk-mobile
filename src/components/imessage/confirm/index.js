import React, { Component } from 'react';
import { View } from 'react-native';
import FormattedNumber from '../../formattedNumber';
import { toRawLsk, includeFee } from '../../../utilities/conversions';
import { PrimaryButton, Button } from '../../toolBox/button';
import Avatar from '../../avatar';
import Icon from '../../toolBox/icon';
import { B, P, Small } from '../../toolBox/typography';
import { colors } from '../../../constants/styleGuide';
import styles from './styles';
import * as transactionsAPI from '../../../utilities/api/lisk/transactions';
import { extractAddress } from '../../../utilities/api/lisk/account';

class Confirm extends Component {
  state = {
    errorMessage: false,
    busy: false,
  }

  send = async () => {
    if (this.state.busy) {
      return;
    }

    const {
      composeMessage,
      passphrase,
      sharedData: { address, amount },
    } = this.props;

    const data = {
      recipientAddress: address,
      amount: toRawLsk(amount),
      passphrase,
    };

    this.setState({ busy: true, errorMessage: '' });

    try {
      this.setState({ busy: false });

      const tx = await transactionsAPI.create(data);
      const { id } = await transactionsAPI.broadcast(tx);

      composeMessage({
        id,
        address: { value: extractAddress(passphrase), validity: 0 },
        amount,
        state: 'transferred',
        recipientAddress: address,
      });
    } catch (error) {
      this.setState({
        busy: false,
        errorMessage: error.message || 'An error happened. Please try later.',
      });
    }
  }

  render() {
    const {
      composeMessage,
      conversation,
      message,
      state,
      sharedData: { address, amount },
    } = this.props;

    const { busy, errorMessage } = this.state;

    const isSender = (
      conversation.localParticipiantIdentifier === message.senderParticipantIdentifier
    );
    const fee = 1e7;
    const totalAmount = isSender ? amount : includeFee(amount, fee);
    const description = isSender ?
      `Your request of ${totalAmount} LSK is pending response.` :
      `By accepting this request, you'll send ${totalAmount} LSK (including transaction fee) from your account.`;

    const rejectMessage = () => {
      composeMessage({
        address: { value: address, validity: 0 },
        amount,
        state: 'rejected',
      });
    };

    return (
      <View style={styles.container}>
        {
          state === 'requested' ?
            <View style={styles.innerContainer}>
              <View>
                <View style={[styles.row, styles.addressContainer]}>
                  <B style={styles.title}>Requested by</B>
                  <Avatar address={address || ''} style={styles.avatar} size={50} />
                  <P style={[styles.text, styles.address]}>
                    {address}
                  </P>
                </View>
                <View style={styles.row}>
                  <Icon
                    name='amount'
                    style={styles.icon} size={20}
                    color={colors.light.gray2}
                  />
                  <View style={styles.rowContent}>
                    <P style={styles.label}>
                      Amount {isSender ? '' : '(including 0.1 LSK)'}
                    </P>
                    <B style={[styles.text]}>
                      <FormattedNumber>
                        {totalAmount}
                      </FormattedNumber>
                    </B>
                  </View>
                </View>
                <B style={styles.description}>
                  {description}
                </B>
              </View>
              {
                isSender ?
                  null :
                  <View>
                    <View style={[styles.errorContainer, errorMessage ? styles.visible : null]}>
                      <Icon size={16} name='warning' style={styles.errorIcon} />
                      <Small style={styles.error}>{errorMessage}</Small>
                    </View>
                    <Button
                      disabled={busy}
                      style={styles.rejectButton}
                      onClick={rejectMessage}
                      title='Reject'
                    />
                    <PrimaryButton
                      style={[styles.button, busy ? styles.buttonBusy : {}]}
                      onClick={this.send}
                      title={busy ? 'Transferring...' : 'Accept'}
                    />
                  </View>
              }
            </View> :
            <View style={[styles.innerContainer, styles.confirmContainer]}>
              <B style={styles.confirmMessage}>
                You have {state} {amount} LSK.
                Send the message to let {address} know.
              </B>
            </View>
        }
      </View>
    );
  }
}

export default Confirm;
