import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Layout, Menu, Row, Col,Tooltip } from "antd";
import {LogoutOutlined } from '@ant-design/icons';
import logo from "./logo.svg";
import * as actionCreators from '../../../../../redux/components/pages/home/header/actions';

import './index.css'

const { Header } = Layout;

class HeaderComponent extends React.Component {

    onLogout = () => {
        console.log('Clicked')
        this.props.onLogout()
    }

    render() {
        return(
            <Header>
                <Row >
                    <Col span={1}>
                        <div className="logo">
                            <Link to='/'>
                                    <img src={logo}  height='25' alt='logo' />
                            </Link>

                        </div>
                    </Col>
                    <Col span={1} offset={22}>
                        <div align="right">
                            <Menu
                                theme="dark"
                                mode="horizontal"
                                selectable={false}
                                onClick={this.onLogout}
                            >
                                <Menu.Item key="1">
                                    <Tooltip title="Logout">
                                    <LogoutOutlined />
                                    </Tooltip>
                                </Menu.Item>
                            </Menu>
                        </div>
                        
                    </Col>

                </Row>
                
               
            </Header>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actionCreators.onLogout())
        
    }
};


export default connect(null, mapDispatchToProps)(HeaderComponent);


