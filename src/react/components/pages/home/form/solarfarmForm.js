import React, { Component } from 'react'
import { Form,Input, Select } from 'antd';
import {GlobalOutlined } from '@ant-design/icons';
import  store from '../../../../../redux/store'
import _, { times,isUndefined } from 'lodash';
import './index.css'
const { Option } = Select;
const stringToNumber = (value) => {
    let output = (' ' + value).slice(1)
    output = output.replace(',', '.')
    return Number(output)

}

export class SolarfarmForm extends Component {
    formRef=React.createRef()
    constructor(props) {
        super(props)
  
        this.state = {
            currentLastgang: null,
            isScrolldownFocused: false
        }
    }
    componentDidMount() {
        this.props.reference(this.formRef)
      }
    componentWillMount() {
        this.props.reference(this.formRef)
      }
    getLastgangData = () => {
        const lastgang = []
        if (this.props.lastgangData) {
            for (let i = 0; i < this.props.lastgangData.length; i++) {
                let lastgangOption = (this.props.lastgangData[i]).split('windfarmtest/')[1]
                lastgang.push(lastgangOption)
            }
            return [...new Set(lastgang)]
        }
        else {
            return []
        }
    }

    latitudeValidator = (rule, value, callback) => {
        try {
            let output = stringToNumber(value)

            if ((output < -90) || (output > 90) || (isNaN(output))) {
                throw new Error('Please enter a number between -90 to 90.');
            }
            callback()
        }

        catch (err) {
            callback(err);
        }
    }

    longitudeValidator = (rule, value, callback) => {
        try {
            let output = stringToNumber(value)

            if ((output < -180) || (output > 180) || (isNaN(output))) {
                throw new Error('Please enter a number between -180 to 180.');
            }

            callback()
        }

        catch (err) {
            callback(err);
        }
    }

    onLastgangChange = (value) => {
        this.setState({
            isScrolldownFocused: false,
            currentLastgang: value
        })
    }

    makeSelectStateTrue = () => {
        this.setState({
            isScrolldownFocused: true
        })
    }

    makeSelectStateFalse = () => {
        this.setState({
            isScrolldownFocused: false
        })
    }

    render() {
        const { latitude, longitude } = this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 16 },
                sm: { span: 16 },
            },
        };

        const lastgangData = this.getLastgangData()
        return (
            <Form ref={this.formRef}{...formItemLayout}  className="farm-form" requiredMark={true}>
                <Form.Item
                    form={this.props.form}
                    name="latitude"
                    label="Latitude"
                    decoratorstring="latitude"
                    initialValue={!_.isEmpty(this.props.formData)?latitude:store.getState().home.map.latitude}
                    rules={[
                        {
                          required: true,
                          message: "Field is empty",
                        },
                        () => ({
                            validator(rules,value = " "){
                            if (((stringToNumber(value) < -90) || (stringToNumber(value) > 90) || isNaN(stringToNumber(value)))) {
                                return Promise.reject('Please enter a number between -90 to 90.');
                            }
                            else{
                                    return Promise.resolve();
                                }
                              
                            
                        }
                         
                        })
                      ]}
                    >
                    {(()=>{
               return <Input
               prefix={<GlobalOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
               placeholder="Latitude"
           />
                    })()
                }
                </Form.Item>

                <Form.Item
                    form={this.props.form}
                    name="longitude"
                    label="Longitude"
                    decoratorstring="longitude"
                    initialValue={!_.isEmpty(this.props.formData)?longitude:store.getState().home.map.longitude}
                    rules={[
                        {
                          required: true,
                          message: "Field is empty",
                        },
                        () => ({
                            validator(rules,value = " "){
                            if (((stringToNumber(value) < -180) || (stringToNumber(value) > 180) || (isNaN(stringToNumber(value))))) {
                                return Promise.reject('Please enter a number between -180 to 180.');
                            }
                            else{
                                return Promise.resolve();
                                }
                              
                            
                        }
                         
                        })
                      ]}
                    >
                    {(()=>{
                    return <Input
               prefix={<GlobalOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
               placeholder="Longitude"
           />
                    })()
                }
                </Form.Item>

                <Form.Item
                    form={this.props.form}
                    name="project"
                    label="Project"
                    decoratorstring="project"
                    initialValue={_.has(this.props.formData, 'project') ? this.props.formData.project : null}
                    rules={[
                        {
                          required: true,
                          message: "Field is empty",
                        },
                        () => ({
                            validator(rules,value = " "){
                            if ((!typeof (value) === 'string')) {
                                return Promise.reject('Please enter a valid project.') 
                            }
                            else{
                                    return Promise.resolve();
                                }
                              
                            
                        }
                         
                        })
                      ]}
                    >
                    {(()=>{
                    return <Input
                        placeholder="Project"
                    />
                    })()
                }
                </Form.Item>

                <Form.Item
                    form={this.props.form}
                    label="DC/AC Capacity"
                    name="acdc_capacity"
                    decoratorstring="acdc_capacity"
                    initialValue={_.has(this.props.formData, 'acdc_capacity') ? this.props.formData.acdc_capacity : null}
                    rules={[
                        {
                          required: true,
                          message: "Field is empty",
                        },
                        () => ({
                            validator(rules,value = " "){
                                if (((stringToNumber(value) < 1) || (!Number.isInteger(stringToNumber(value))))) {
                                    return Promise.reject('DC/AC Capacity must be an valid integer.');
                                }
                                else{
                                        return Promise.resolve();
                                    }
                              
                            
                        }
                         
                        })
                      ]}
                    >
                    {(()=>{
                    return <Input
                        placeholder="DC/AC Capacity"
                    />
                    })()
                }
                </Form.Item>

                <Form.Item
                    form={this.props.form}
                    label="Rated Capacity"
                    name="rated_capacity"
                    decoratorstring="rated_capacity"
                    initialValue={_.has(this.props.formData, 'rated_capacity') ? this.props.formData.rated_capacity : null}
                    rules={[
                        {
                          required: true,
                          message: "Field is empty",
                        },
                        () => ({
                            validator(rules,value = " "){
                                if (((stringToNumber(value) < 1) || (!Number.isInteger(stringToNumber(value))))) {
                                    return Promise.reject('Rated Capacity must be an valid integer.');
                                }
                                else{
                                        return Promise.resolve();
                                    }
                              
                            
                        }
                         
                        })
                      ]}
                    >
                    {(()=>{
                    return <Input
                        placeholder="Rated Capacity"
                    />
                    })()
                }
                </Form.Item>

                <Form.Item
                    form={this.props.form}
                    label="Azimuth Angle"
                    name="pv_azimuth"
                    decoratorstring="pv_azimuth"
                    initialValue={_.has(this.props.formData, 'pv_azimuth') ? this.props.formData.pv_azimuth : null}
                    rules={[
                        {
                          required: true,
                          message: "Field is empty",
                        },
                        () => ({
                            validator(rules,value = " "){
                                if (((stringToNumber(value) < 1) || (isNaN(stringToNumber(value))))) {
                                    return Promise.reject('Azimuth Angle must be an valid number.');
                                }
                                else{
                                        return Promise.resolve();
                                    }
                              
                            
                        }
                         
                        })
                      ]}
                    >
                    {(()=>{
                    return <Input
                    placeholder="Azimuth Angle"
                    />
                    })()
                }
                </Form.Item>

                <Form.Item
                    form={this.props.form}
                    label="Tilt"
                    name="pv_tilt"
                    decoratorstring="pv_tilt"
                    initialValue={_.has(this.props.formData, 'pv_tilt') ? this.props.formData.pv_tilt : null}
                    rules={[
                        {
                          required: true,
                          message: "Field is empty",
                        },
                        () => ({
                            validator(rules,value = " "){
                            if (((stringToNumber(value) < 1) || (isNaN(stringToNumber(value))))) {
                                return Promise.reject('Tilt must be an valid number.');
                            }
                            else{
                                    return Promise.resolve();
                                }
                              
                            
                        }
                         
                        })
                      ]}
                    >
                    {(()=>{
                    return <Input
                    placeholder="Tilt"
                    />
                    })()
                }
                </Form.Item>

                <Form.Item
                    form={this.props.form}
                    label="Type of PV Panel"
                    name="pv_panel"
                    decoratorstring="pv_panel"
                    initialValue={_.has(this.props.formData, 'pv_panel') ? this.props.formData.pv_panel : undefined}
                    validatorerrormessage='Please select a valid pv panel.'
                    rules={[
                        {
                          required: true,
                          message: "Field is empty",
                        },
                        
                      ]}
                    >
                    {(()=>{
                    return <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Select type of PV Panel"
                >
                    <Option key="Monocrystalline">Monocrystalline</Option>
                    <Option key="Polycrystalline">Polycrystalline</Option>
                    <Option key="Thin Film">Thin Film</Option>
                </Select>
                    })()
                }
                </Form.Item>

                <Form.Item
                    form={this.props.form}
                    label="Actual Source"
                    name="actual_source"
                    decoratorstring="actual_source"
                    initialValue={_.has(this.props.formData, 'actual_source') ? this.props.formData.actual_source : undefined}
                    rules={[
                        {
                          required: false,
                          message: "Field is empty",
                        },
                        () => ({
                            validator(rules,value = " "){
                                return Promise.resolve();
                                    
                            }
                         
                        })
                      ]}
                    >
                    {(()=>{
                    return <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Select Source"
                    optionFilterProp="children"
                    onBlur={this.makeSelectStateFalse}
                    onFocus={this.makeSelectStateTrue}
                    onChange={this.onLastgangChange}
                    allowClear={true}
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {lastgangData.reduce((acc, lastgang) => {
                        if (lastgang) {
                            acc.push(<Option key={lastgang}>{lastgang}</Option>)
                        }
                        return acc
                    }, [])}

                </Select>
                    })()
                }
                </Form.Item>

            </Form>
        )
    }
}

export default SolarfarmForm
