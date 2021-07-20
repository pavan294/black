import React from 'react';
import { Layout, Card } from 'antd';
import { connect } from "react-redux";
import { Tabs } from 'antd';

import HeaderComponent from '../../components/pages/home/header';
import MapComponent from '../../components/pages/home/map';
import TableComponent from '../../components/pages/home/table';
// import FarmOptions from '../../components/pages/home/table/options';
import ErrorComponent from './errors';
import AppIdleLayer from './idle';
import { farmColumns, createJobColumns } from '../../components/pages/home/table/headers';
import { setFarmType } from '../../../redux/components/pages/home/app/actions';
import { WINDFARM, SOLARFARM } from '../../../constants';
import './index.css';

const { TabPane } = Tabs;
const { Content } = Layout;

class HomePage extends React.Component {
    handleTabChange = farmType => {
        this.props.setFarmType(farmType)
    }

    render() {
        return (
            <ErrorComponent>
                <AppIdleLayer />
                <Layout className={this.props.idle_state ? 'blur-bg homePageLayout' : 'homePageLayout'} >
                    <HeaderComponent />
                    <Content>
                        <Card>
                            <Tabs activeKey={this.props.farmType} onChange={this.handleTabChange}>
                                <TabPane tab={WINDFARM} key={WINDFARM} />
                                <TabPane tab={SOLARFARM} key={SOLARFARM} />
                            </Tabs>
                            <MapComponent 
                                farmType={this.props.farmType}
                            />
                        </Card>
                        <Card className="tableCard">
                            <TableComponent
                                farmType={this.props.farmType}
                                createColumns={farmColumns[this.props.farmType]}
                                createJobColumns={createJobColumns}
                            />
                        </Card>
                    </Content>
                </Layout>
            </ErrorComponent>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        idle_state: state.home.app.idle_state,
        farmType: state.home.app.farmType
    };
}

const mapDispatchToProps = {
    setFarmType
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
