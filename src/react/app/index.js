import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { withAuthenticator } from 'aws-amplify-react';
import { myTheme } from '../../amplify';
import HomePage from '../pages/home';
import ErrorComponent from '../pages/home/errors'
import { connect } from "react-redux"
import * as errorActions from '../../redux/components/pages/home/errors/actions'
import * as appActions from '../../redux/components/pages/home/app/actions'
import IdleTimer from 'react-idle-timer'
import "@aws-amplify/ui/dist/style.css";
import "antd/dist/antd.css";
import "./index.css";

const MAX_IDLE_STATE_DURATION = process.env.REACT_APP_MAX_IDLE_STATE_DURATION


class App extends React.Component {
  constructor(props) {
    super(props)

    this.onAction = this._onAction.bind(this)
    this.onActive = this._onActive.bind(this)
    this.onIdle = this._onIdle.bind(this)
  }

  update404ErrorState() {
    this.props.set404Error()
  }

  render() {
    return (
      <>
        <IdleTimer
          ref={ref => { this.idleTimer = ref }}
          // element={document}
          onActive={this.onActive}
          onIdle={this.onIdle}
          onAction={this.onAction}
          debounce={250}
          timeout={1000 * 60 * MAX_IDLE_STATE_DURATION} />
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='*'
            render={() => {
              this.update404ErrorState();
              return <ErrorComponent />
            }} />
        </Switch>
      </>
    );
  }
  _onAction(e) {
    console.log('user did something', e)
  }

  _onActive(e) {
    console.log('user is active', e)
    console.log('time remaining', this.idleTimer.getRemainingTime())
  }

  _onIdle(e) {
    console.log('user is idle', e)
    console.log('last active', this.idleTimer.getLastActiveTime())
    this.props.updateAppIdleState(true)
  }
}

const mapStateToProps = (state) => {
  return {
  };
};
const mapDispatchToProps = dispatch => {
  return {
    set404Error: () => dispatch(errorActions.set404Error()),
    updateAppIdleState: (idle_state) => dispatch(appActions.updateAppIdleState(idle_state))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withAuthenticator(App, false, [], null, myTheme));
