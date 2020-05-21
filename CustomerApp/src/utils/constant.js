// export const baseUrl = 'http://192.168.43.240:5555';
export const baseUrl = 'https://e-madhushala-backend.herokuapp.com';

export const authTokenName = 'eMadhushala_customer_auth_token';

export const verificationDocumentType = [
  {
    name: 'Aadhar Card',
    value: 'aadhar-id',
  },
  {
    name: 'Voter ID Card',
    value: 'voter-id',
  },
];

export const addressType = [
  {
    name: 'Home',
    value: 'home',
    icon: 'home',
  },
  {
    name: 'Work',
    value: 'work',
    icon: 'briefcase',
  },
  {
    name: 'Other',
    value: 'other',
    icon: 'map-marker',
  },
];

export const categoryList = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Beer',
    value: 'br',
  },
  {
    label: 'Vodka',
    value: 'vod',
  },
  {
    label: 'Whiskey',
    value: 'wh',
  },
  {
    label: 'Rum',
    value: 'rm',
  },
  {
    label: 'Brandy',
    value: 'brd',
  },
  {
    label: 'Wine',
    value: 'wn',
  },
  {
    label: 'Tequila',
    value: 'tql',
  },
  {
    label: 'Desi Daru',
    value: 'dd',
  },
];

export const paymentMode = [
  {
    name: 'Cash on Delivery',
    value: 'cod',
  },
  {
    name: 'Online',
    value: 'online',
  },
];

export const orderStatus = [
  {
    label: 'All',
    value: 'all',
    color: '-',
  },
  {
    label: 'Pending',
    value: 'pen',
    color: 'orange',
  },
  {
    label: 'Processing',
    value: 'prc',
    color: 'blue',
  },
  {
    label: 'Processed',
    value: 'prcd',
    color: '#EE82EE',
  },
  {
    label: 'Out For Delivery',
    value: 'ofd',
    color: '#FF1493',
  },
  {
    label: 'Delivered',
    value: 'del',
    color: 'green',
  },
  {
    label: 'Cancelled',
    value: 'can',
    color: 'red',
  },
];

export const verificationStatus = [
  {
    label: 'Pending',
    value: 'pen',
    color: 'orange',
  },
  {
    label: 'Verified',
    value: 'ver',
    color: 'green',
  },
  {
    label: 'Rejected',
    value: 'rej',
    color: 'red',
  },
];
