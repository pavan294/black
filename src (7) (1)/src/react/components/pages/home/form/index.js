import React from 'react';
import { connect } from "react-redux";
import { Button, Modal } from 'antd';
import moment from 'moment';
import { Auth } from 'aws-amplify';
import _ from 'lodash';
import WindfarmForm from './windfarmForm'
import SolarfarmForm from './solarfarmForm'
import { WINDFARM, SOLARFARM } from '../../../../../constants';
import * as formActionCreators from '../../../../../redux/components/pages/home/form/actions'
import * as tableActionCreators from '../../../../../redux/components/pages/home/table/actions'
import * as mapActionCreators from '../../../../../redux/components/pages/home/map/actions'
import './index.css'


class CustomForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentManufacturer: null,
            currentModel: null,
            currentHubHeight: null,
            currentRatedPower: null,
            currentLastgang: null,
            isScrolldownFocused: false
        }
    }

    shouldComponentUpdate() {
        if (this.props.visible && this.state.isScrolldownFocused) {
            return false
        }
        return true
    }

    render() {
        const { reference, visible, onCancel, onCreate, modalHeader, latitude, longitude } = this.props;
        return (
            <Modal
                destroyOnClose={true}
                visible={visible}
                title={modalHeader}
                okText={"Save"}
                onCancel={onCancel}
                onOk={onCreate}
            >
                {
                    this.props.farmType === WINDFARM ?
                        <WindfarmForm
                            reference={reference}
                            latitude={this.props.formData.latitude?this.props.formData.latitude:latitude}
                            longitude={this.props.formData.longitude?this.props.formData.longitude:longitude}
                            turbineData={this.props.turbineData}
                            lastgangData={this.props.lastgangData}
                            form={this.props.form}
                            formData={this.props.formData} /> :
                        <SolarfarmForm
                            reference={reference}
                            latitude={this.props.formData.latitude?this.props.formData.latitude:latitude}
                            longitude={this.props.formData.longitude?this.props.formData.longitude:longitude}
                            turbineData={this.props.turbineData}
                            lastgangData={this.props.lastgangData}
                            form={this.props.form}
                            formData={this.props.formData} />
                }
            </Modal >
        )
    }
}
class FormComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            longitude: this.props.longitude,
            latitude: this.props.latitude
        }
        this.formRef = React.createRef()
    }


    componentDidUpdate(prevProps) {
        const farmType = this.props.farmType
        if (this.props.visible & (!prevProps.visible) & (this.props.modalHeader === `Edit ${farmType}`)) {
            // When opened to edit
            if (this && this.formRef && this.formRef.props) {
                this.formRef.props.form.setFieldsValue(this.props.formData)
                this.setState({
                    latitude: this.props.formData.latitude,
                    longitude: this.props.formData.longitude
                })
            }
        }

        if (this.props.visible & (!prevProps.visible) & (this.props.modalHeader === `Add ${farmType}`)) {
            // When open to add
            if (this && this.formRef && this.formRef.props) {
                this.formRef.props.form.setFieldsValue({
                    'latitude': this.props.latitude,
                    'longitude': this.props.longitude
                })
                this.setState({
                    latitude: this.props.latitude,
                    longitude: this.props.longitude
                })
            }
        }
    }

    showModal = () => {
        this.props.updateModalHeader(`Add ${this.props.farmType}`)
        this.props.setModalVisibleTrue()
    }

    handleCancel = () => {
        this.props.setModalVisibleFalse()
    };

    handleCreate = (e) => {
        e.preventDefault();
        let form = this.formRef.current;
        form.validateFields().then((values) => {
            values['latitude'] = _.toString(values['latitude']).replace(',', '.')
            values['longitude'] = _.toString(values['longitude']).replace(',', '.')

            
            if (!values['noiseReduction']) {
                values['wka_startschall'] = '';
                values['wka_endschall'] = '';
                values['wka_reduction_schall'] = '';
            }
            
            if (this.props.farmType === SOLARFARM) {
                values['type'] = 'solar'
                values['unit_power'] = 'kW'
                values['unit_production'] = 'kWh'
            }
            if (this.props.modalHeader === `Edit ${this.props.farmType}`) {
                values["_id"] = this.props.formData['_id']
                console.log('Received values of form: ', values);
                let farm = _.filter(this.props.windfarmData, { _id: this.props.formData['_id'] })
                if (farm.length && _.has(farm[0], "author")) {
                    values.author = farm[0].author
                    values.date_added = farm[0].date_added
                }
                this.props.patchRow(values["_id"], values, () => {
        
                    if (farm.length && _.isEqual(this.props.lastSelectedPostion, [farm[0].latitude, farm[0].longitude])) {
                        this.props.onUpdateLastSelectedPosition(values['latitude'], values['longitude'])
                    }
                
                })
            }
            else {
                Auth.currentAuthenticatedUser({
                    bypassCache: false  
                }).then(user => {
                    values.date_added = moment().format('YYYY-MM-DDThh:mm:ss.SSSSSS')
                    values.author = user.username
                    this.props.postRow(values)
                })
            }
            form.resetFields()
            this.props.setModalVisibleFalse()
            this.props.fetchWindfarmData()
        }).catch((err) => {
            if (err) {
                return;
            }
        })
    };
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    render() {

        return (
            <div>
                <Button type="primary" onClick={this.showModal} id="add_edit_farm_modal">
                    {`Add ${this.props.farmType}`}
                </Button>
                <CustomForm
                    reference={this.saveFormRef}
                    visible={this.props.visible}
                    modalHeader={this.props.modalHeader}
                    turbineData={this.props.turbineData}
                    lastgangData={this.props.lastgangData}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    latitude={this.state.latitude}
                    longitude={this.state.longitude}
                    formData={this.props.formData}
                    farmType={this.props.farmType}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        latitude: state.home.map.latitude,
        longitude: state.home.map.longitude,
        visible: state.home.form.modalVisible,
        formData: state.home.form.formData,
        modalHeader: state.home.form.modalHeader,
        turbineData: state.home.table.turbineData,
        lastgangData: state.home.table.lastgangData,
        farmType: state.home.app.farmType,
        windfarmData: state.home.table.windfarmData,
        lastSelectedPostion: state.home.map.lastSelectedPostion
    };
};

const mapDispatchToProps = dispatch => {
    return {
        postRow: (doc) => dispatch(tableActionCreators.postRow(doc)),
        patchRow: (doc_id, doc, cb) => dispatch(tableActionCreators.patchRow(doc_id, doc, cb)),
        fetchWindfarmData: () => dispatch(tableActionCreators.fetchWindfarmData()),
        setModalVisibleFalse: () => dispatch(formActionCreators.setModalVisibleFalse()),
        setModalVisibleTrue: () => dispatch(formActionCreators.setModalVisibleTrue({})),
        updateModalHeader: (header) => dispatch(formActionCreators.updateModalHeader(header)),
        onUpdateLastSelectedPosition: (latitude, longitude) => dispatch(mapActionCreators.onUpdateLastSelectedPosition(latitude, longitude)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(FormComponent);
