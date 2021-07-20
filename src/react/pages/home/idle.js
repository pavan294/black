import React, { Component } from 'react'
import { connect } from "react-redux";
import {ReloadOutlined } from '@ant-design/icons';
import './index.css'
import * as appActions from '../../../redux/components/pages/home/app/actions'

export class AppIdleLayerComponent extends Component {

    updateAppIdleState = () => {
        this.props.updateAppIdleState(false)
    }

    render() {
        let app_idle_state = this.props.idle_state
        return (
            <span>
                {
                    app_idle_state &&
                    <div className="idle-component"><ReloadOutlined onClick={() => { this.updateAppIdleState() }} style={{ fontSize: '125px', twoToneColor: '#0462a9', cursor: 'pointer', position: 'absolute', top: '45%' }} /></div>
                }
            </span>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        idle_state: state.home.app.idle_state
    };
};
const mapDispatchToProps = dispatch => {
    return {
        updateAppIdleState: (idle_state) => dispatch(appActions.updateAppIdleState(idle_state))
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(AppIdleLayerComponent);