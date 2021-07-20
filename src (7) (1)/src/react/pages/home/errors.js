import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';
import * as errorActions from '../../../redux/components/pages/home/errors/actions'
import * as appActions from '../../../redux/components/pages/home/app/actions'

class ErrorComponent extends React.Component {

  componentWillUnmount() {
    this.props.setErrorFalse()
  }
  resetAppErrors = () => {
    // set errors to false
    this.props.setErrorFalse()
    // reset axios calls fail counter
    this.props.updateAxiosFailCount(0)
  }

  render() {
    if (this.props.errors.status) {
      return (
        <Result
          status={this.props.errors.errorType}
          title={"Error"}
          subTitle={this.props.errors.errorMessage}
          extra={
            <Link to="/">
              <Button type="primary" onClick={this.resetAppErrors}>
                Back to Home
                    </Button>
            </Link>
          }
        ></Result>
      )

    }
    return this.props.children;
  }
}

const mapStateToProps = (state) => {
  return {
    errors: state.home.errors,

  };
};
const mapDispatchToProps = dispatch => {
  return {
    setErrorFalse: () => dispatch(errorActions.setErrorFalse()),
    updateAxiosFailCount: (counter) => dispatch(appActions.updateAxiosFailCount(counter))
  }
};



export default connect(mapStateToProps, mapDispatchToProps)(ErrorComponent);
