import {StyleSheet} from 'react-native';

import variables from './variables';

const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  alignCenter: {
    flex: 1,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  col1: {
    width: '8.333333%',
    paddingLeft: 5,
    paddingRight: 5,
  },
  col2: {
    width: '16.666667%',
    paddingLeft: 5,
    paddingRight: 5,
  },
  col3: {
    width: '25%',
    paddingLeft: 5,
    paddingRight: 5,
  },
  col4: {
    width: '33.333333%',
    paddingLeft: 5,
    paddingRight: 5,
  },
  col5: {
    width: '41.666667%',
    paddingLeft: 5,
    paddingRight: 5,
  },
  col6: {
    width: '50%',
    paddingLeft: 5,
    paddingRight: 5,
  },
  col7: {
    width: '58.333333%',
    paddingLeft: 5,
    paddingRight: 5,
  },
  col8: {
    width: '66.666667%',
    paddingLeft: 5,
    paddingRight: 5,
  },
  col9: {
    width: '75%',
    paddingLeft: 5,
    paddingRight: 5,
  },
  col10: {
    width: '83.333333%',
    paddingLeft: 5,
    paddingRight: 5,
  },
  col11: {
    width: '91.666667%',
    paddingLeft: 5,
    paddingRight: 5,
  },
  col12: {
    width: '100%',
    paddingLeft: 5,
    paddingRight: 5,
  },
  formGroup: {
    marginTop: 10,
    marginBottom: 10,
  },
  formLabel: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#86939e',
  },
  infoGroup: {
    marginTop: 10,
    marginBottom: 10,
  },
  labelGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontSize: 20,
  },
  labelText: {
    fontSize: 20,
    color: '#797A9C',
    fontStyle: 'italic',
  },
  value: {
    color: variables.mainThemeColor,
    fontSize: 20,
  },
  outlineBtn: {
    borderColor: variables.mainThemeColor,
    borderWidth: 2,
  },
});

export default mainStyles;
