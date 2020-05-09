// export const baseUrl = 'http://192.168.43.240:5555';
export const baseUrl = 'https://e-samagri-backend.herokuapp.com';

export const authTokenName = 'eSamagri_delivery_auth_token';

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
];
