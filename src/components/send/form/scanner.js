import React, { Fragment } from 'react';
import { View, Platform } from 'react-native';
import Permissions from 'react-native-permissions';
import { RNCamera } from 'react-native-camera';
import QRCode from '@remobile/react-native-qrcode-local-image';
import styles from './styles';
import CameraAccess from './cameraAccess';
import CameraOverlay from './cameraOverlay';
import CameraRoll from './cameraRoll';

class Scanner extends React.Component {
  state = {
    camera: {
      permission: 'undetermined',
      visible: false,
    },
    photo: {
      permission: 'undetermined',
      visible: false,
    },
  }

  componentDidMount() {
    this.checkPermissions();
  }

  checkPermissions = () => {
    Permissions.checkMultiple(['camera', 'photo']).then((response) => {
      this.setPermissions(response);
    });
  }

  setPermissions = (permissions) => {
    const { camera, photo } = this.state;
    camera.permission = permissions.camera;
    photo.permission = permissions.photo;
    this.setState({ camera, photo });
  }

  toggleCamera = () => {
    const { camera } = this.state;
    this.props.navigation.setParams({
      tabBar: !camera.visible,
      showButtonLeft: !camera.visible,
      action: this.toggleCamera,
      onBackPress: this.toggleCamera,
    });

    camera.visible = !camera.visible;
    this.setState({ camera });
  };

  toggleGallery = () => {
    const { photo } = this.state;
    this.props.navigation.setParams({
      tabBar: true,
      showButtonLeft: true,
      action: !photo.visible ? this.toggleGallery : this.toggleCamera,
      onBackPress: this.toggleGallery,
    });

    photo.visible = !photo.visible;
    this.setState({ photo });
  }

  readFromPhotoGallery = (items) => {
    const { photo, camera } = this.state;
    photo.visible = false;
    camera.visible = false;
    this.setState({ photo, camera });

    this.props.navigation.setParams({
      tabBar: photo.visible,
      showButtonLeft: photo.visible,
    });

    if (items.length > 0) {
      QRCode.decode(items[0].uri, (error, result) => {
        this.decodeQR(result);
      });
    }
  }

  readQRcode = (event) => {
    this.toggleCamera();
    this.decodeQR(event.data);
  }

  decodeQR = (data) => {
    const recipientReg = /recipient=\d{1,21}L/;
    const amountReg = /amount=(\d+)\.?(\d+)?/;
    const liskProtocolReg = /^[l|L]isk:\/\//;

    if (liskProtocolReg.test(data) && recipientReg.test(data)) {
      const address = data.match(recipientReg)[0].replace('recipient=', '');
      const amount = data.match(amountReg)[0].replace('amount=', '');
      this.props.setAddress(address || '');
      this.props.setAmount(amount || '');
    } else {
      this.props.setAddress(data || '');
      this.props.setAmount('');
    }
  }

  render() {
    const { camera, photo } = this.state;
    return (
      <Fragment>
        {
          camera.visible ?
            <RNCamera
              ref={(ref) => {
                this.camera = ref;
              }}
              style = {[styles.preview, styles.cameraPreview]}
              onBarCodeRead={this.readQRcode}
              barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
              type={RNCamera.Constants.Type.back}
              permissionDialogTitle={'Permission to use camera'}
              permissionDialogMessage={'Lisk needs to connect to your camera'} >
              <CameraOverlay
                toggleGallery={this.toggleGallery}
                photoPermission={photo.permission} />
            </RNCamera>
          : null
        }
        <CameraRoll
          onSelect={this.readFromPhotoGallery}
          permission={photo.permission}
          visible={photo.visible} />
      </Fragment>
    );
  }
}

export default Scanner;
