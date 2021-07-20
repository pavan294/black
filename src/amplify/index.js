import Amplify from 'aws-amplify';

// Configure Auth category with your Amazon Cognito credentials
Amplify.configure({
    Auth: {
        userPoolId: process.env.REACT_APP_USER_POOL_ID, // Amazon Cognito Identity Pool ID
        userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
        region: process.env.REACT_APP_AWS_REGION, // Amazon Cognito Region
    }
  });
  
export const myTheme = {
    a: { 'color': '#001529' },
    button: { 'backgroundColor': '#001529' }
  };
