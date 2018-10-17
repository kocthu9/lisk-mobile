import { StyleSheet } from 'react-native';
import { colors } from '../../constants/styleGuide';


const styles = {
  blurContainer: {
    flex: 1,
    marginTop: -55,
  },
  container: {
    position: 'absolute',
    width: '100%',
    // height: 400,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(58, 131, 192, 1)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: 'column',
    // justifyContent: 'space-between',
  },
  title: {
    color: colors.white,
    textAlign: 'center',
    marginTop: 20,
    paddingBottom: 20,
    borderBottomColor: 'rgba(256, 256, 256, 0.1)',
    borderBottomWidth: 1,
  },
  innerContainer: {
    marginBottom: 50,
    marginTop: 50,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 100,
    height: 100,
    backgroundColor: colors.white,
    borderRadius: 50,
    paddingTop: 20,
    marginBottom: 24,
  },
  icon: {
    textAlign: 'center',
    // color: colors.white,
  },
  description: {
    textAlign: 'center',
    color: colors.white,
  },
  error: {
    color: colors.action1,
    textAlign: 'center',
    // paddingBottom: 10,
    marginTop: 15,
  },
};

export default StyleSheet.create(styles);