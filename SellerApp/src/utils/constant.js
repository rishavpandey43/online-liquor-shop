export const baseUrl = 'http://192.168.43.240:5555';
// export const baseUrl = 'https://e-samagri-backend.herokuapp.com';

export const authTokenName = 'eSamagri_seller_auth_token';

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

export const categoryList = [
  {
    label: '-',
    value: '',
  },
  {
    label: 'Kitchen Staples',
    value: 'ks',
  },
  {
    label: 'Coffee, Tea & Beverages',
    value: 'bs',
  },
  {
    label: 'Dried Fruits, Nuts & Seeds',
    value: 'dfns',
  },
  {
    label: 'Packed Foods',
    value: 'pf',
  },
  {
    label: 'Snacks & Cookies',
    value: 'sc',
  },
  {
    label: 'Dairy Products',
    value: 'dp',
  },
  {
    label: 'Bakery & Cakes',
    value: 'bc',
  },
  {
    label: 'Personal & Homecare',
    value: 'ph',
  },
  {
    label: 'Health & Wellness',
    value: 'hw',
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
