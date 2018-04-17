import React from 'react';
import { Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { fromRawLsk } from '../../utilities/conversions';
import styles from './styles';

class Item extends React.Component {
  showDetail(tx) {
    this.props.navigate({
      routeName: 'TxDetail',
      params: { tx }
    });
  }
  render () {
    const { tx, account, index } = this.props;
    let arrow = account === tx.senderId  ? 'call-made' : 'call-received';
    let iconColor = account === tx.senderId ? '#EE622D' : '#96C256';
    arrow = tx.timestamp ? arrow : 'error-outline';
    iconColor = tx.timestamp ? iconColor : '#F7C343';
    let recipient = tx.recipientId;
    
    if (tx.type === 3) {
      recipient = 'Vote';
    } else if (tx.type === 2) {
      recipient = 'Register Delegate';
    } else if (tx.type === 1) {
      recipient = 'Register Second Passphrase';
    }

    const style = (index % 2 === 0) ? styles.listItemEven : styles.listItemOdd; 
  
    return (<ListItem
      containerStyle={[style, styles.noBorder]}
      onPress={this.showDetail.bind(this, tx)}
      key={tx.id}
      leftIcon={{name: arrow, style: {color: iconColor}}}
      title={`${fromRawLsk(tx.amount)} LSK`}
      subtitle={`${recipient}`} />);
  }
}

export default Item;
