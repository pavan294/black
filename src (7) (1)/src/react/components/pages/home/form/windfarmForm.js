import React, { Component } from 'react'
import { Form,Input, Select, Checkbox } from 'antd';
import {GlobalOutlined } from '@ant-design/icons';
import _, { isNull } from 'lodash';
import './index.css'

const { Option } = Select;


const stringToNumber = (value) => {
    let output = (' ' + value).slice(1)
    output = output.replace(',', '.')
    return Number(output)
}
const isFloat = (n) => {
    return Number.isInteger(n) || ((typeof n === 'number') && (n % 1 !== 0) && (!isNaN(n)));
}

export class WindfarmForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentManufacturer: null,
            currentModel: null,
            currentHubHeight: null,
            currentRatedPower: null,
            currentLastgang: null,
            isScrolldownFocused: false,
            isNoiseReductionTrue: false,
            currentNoiseReductionFromOption: null,
            currentNoiseReductionToOption: null,
            formData: {}
        }
        this.formRef=React.createRef()
        this.inputRef=React.createRef()
    }
    componentDidMount() {
        this.props.reference(this.formRef)
      }
    componentWillMount() {
        this.props.reference(this.formRef)
      }
    componentDidUpdate() {
        if (!_.isEqual(this.state.formData, this.props.formData)) {
            this.setState({ formData: this.props.formData })
            if (this.props.formData && _.has(this.props.formData, "noiseReduction")) {
                this.setState({ isNoiseReductionTrue: this.props.formData.noiseReduction })
            }
        }
    }

    getManufacturers = () => {

        const manufacturers = []
        for (let i = 0; i < this.props.turbineData.length; i++) {
            if (this.props.turbineData[i].manufacturername !== "") {
                manufacturers.push(this.props.turbineData[i].manufacturername)
            }
        }
        return [...new Set(manufacturers)]

    }

    getModels = (manufacturername) => {

        if (typeof manufacturername === "undefined") {
            return []

        }

        const models = []
        for (let i = 0; i < this.props.turbineData.length; i++) {
            if ((this.props.turbineData[i].manufacturername === manufacturername) && (this.props.turbineData[i].modelname !== "")) {
                models.push(this.props.turbineData[i].modelname)
            }
        }
        return [...new Set(models)]

    }

    getHubHeights = (manufacturername, modelname) => {

        if ((typeof manufacturername === "undefined") || (typeof modelname === "undefined")) {
            return []

        }
        const hubHeights = []
        for (let i = 0; i < this.props.turbineData.length; i++) {
            if ((this.props.turbineData[i].manufacturername === manufacturername) && (this.props.turbineData[i].modelname === modelname)) {
                hubHeights.push(this.props.turbineData[i].height)
            }
        }
        return [...new Set(hubHeights)]

    }

    getRatedPowers = (manufacturername, modelname, hubHeight) => {

        if ((typeof manufacturername === "undefined") || (typeof modelname === "undefined") || (typeof hubHeight === "undefined")) {
            return []

        }

        const ratedPowers = []
        for (let i = 0; i < this.props.turbineData.length; i++) {
            if ((this.props.turbineData[i].manufacturername === manufacturername) && (this.props.turbineData[i].modelname === modelname) && (this.props.turbineData[i].height === hubHeight)) {
                ratedPowers.push(this.props.turbineData[i].ratedpower)
            }
        }
        return [...new Set(ratedPowers)]

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

    getNoiseReductionHoursData = () => {
        const data = []
        let val = ''
        for (let i = 0; i <= 24; i++) {
            if (i < 10) {
                val = "0" + i;
            } else {
                val = i
            }
            val = val + ":00"
            data.push(val)
        }
        return [...new Set(data)]
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

    toggleNoiseReduction = e => {
        //debugger
        this.setState({
            isNoiseReductionTrue: e.target.checked
        });
    };

    onCurrentNoiseReductionFromChange = (value) => {
        this.setState({
            isScrolldownFocused: false,
            currentNoiseReductionFromOption: value
        })
    }

    onCurrentNoiseReductionToChange = (value) => {
        this.setState({
            isScrolldownFocused: false,
            currentNoiseReductionToOption: value
        })
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

    projectValidator = (rule, value, callback) => {
        try {

            callback()
        }

        catch (err) {
            callback(err);
        }
    }


    turbinesValidator = (rule, value, callback) => {
        try {
            let output = stringToNumber(value)

            if ((output < 1) || (output > 70) || (!Number.isInteger(output))) {
                throw new Error('Turbines must be an integer between 1 to 70.');
            }

            callback()
        }

        catch (err) {
            callback(err);
        }
    }

    manufacturerValidator = (rule, value, callback) => {
        try {
            callback()
        }

        catch (err) {
            callback(err);
        }
    }

    modelValidator = (rule, value, callback) => {
        try {
            callback()
        }

        catch (err) {
            callback(err);
        }
    }

    hubHeightValidator = (rule, value, callback) => {
        try {
            callback()
        }

        catch (err) {
            callback(err);
        }
    }

    lastgangValidator = (rule, value, callback) => {
        try {
            callback()
        }

        catch (err) {
            callback(err);
        }
    }

    typeValidator = (rule, value, callback) => {
        try {
            callback()
        }

        catch (err) {
            callback(err);
        }
    }

    onManufacturerChange = (value) => {
        this.setState({
            isScrolldownFocused: false,
            currentManufacturer: value
        })
    }

    onModelChange = (value) => {
        this.setState({
            isScrolldownFocused: false,
            currentModel: value
        })
    }

    onHubHeightChange = (value) => {
        this.setState({
            isScrolldownFocused: false,
            currentHubHeight: value
        })
    }
    validateCurtailment=(value) => {
        debugger
        if (!this.state.isNoiseReductionTrue) {
            return false
        }
        else {
            return (
                this.formRef.current.getFieldValue('ratedPower') === undefined ||
                !isFloat(stringToNumber(value)) ||
                (stringToNumber(value)) > (stringToNumber(this.formRef.current.getFieldValue('ratedPower'))))
        }
    }
    onRatedPowerChange = (value) => {
        this.setState({
            isScrolldownFocused: false,
            currentRatedPower: value
        })
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
        const manufacturers = this.getManufacturers()
        const models = this.getModels(this.state.currentManufacturer)
        const hubHeights = this.getHubHeights(this.state.currentManufacturer, this.state.currentModel)
        const ratedPowers = this.getRatedPowers(this.state.currentManufacturer, this.state.currentModel, this.state.currentHubHeight)
        const lastgangData = this.getLastgangData()
        const noiseReductionFromData = this.getNoiseReductionHoursData()
        const noiseReductionToData = this.getNoiseReductionHoursData()
        return (
            <Form ref={this.formRef} {...formItemLayout} className="farm-form">
                <Form.Item
                    form={this.props.form}
                    label="Latitude"
                    name="latitude"
                    initialValue={latitude ? latitude : 1}
                    rules={[
                        {
                          required: true,
                          message: "Field is empty",
                        },
                        () => ({
                            validator(rules,value = " "){
                                debugger
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
                    label="Longitude"
                    name="longitude"
                    initialValue={longitude}
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
                    label="Project"
                    name="project"
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
                    label="Turbines"
                    name="turbines"
                    initialValue={_.has(this.props.formData, 'turbines') ? this.props.formData.turbines : null}
                    rules={[
                        {
                          required: true,
                          message: "Field is empty",
                        },
                        () => ({
                            validator(rules,value = " "){
                            if ((stringToNumber(value) < 1) || (stringToNumber(value) > 70) || (!Number.isInteger(stringToNumber(value)))) {
                                return Promise.reject('Turbines must be an integer between 1 to 70.') 
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
                        placeholder="Turbines"
                    />
                    })()
                }
                </Form.Item>

                <Form.Item
                    form={this.props.form}
                    label="Manufacturer"
                    name="manufacturer"
                    initialValue={_.has(this.props.formData, 'manufacturer') ? this.props.formData.manufacturer : undefined}
                    rules={[
                        {
                          required: true,
                          message: "Field is empty",
                        },
                        () => ({
                            validator(rules,value = " "){
                            if ((!(value))) {
                                return Promise.reject('Please select a valid manufacturer.') 
                            }
                            else{
                                    return Promise.resolve();
                                }
                              
                            
                        }
                         
                        })
                      ]}
                    >
                    {(()=>{
                    return <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Select Manufacturer"
                    optionFilterProp="children"
                    onBlur={this.makeSelectStateFalse}
                    onFocus={this.makeSelectStateTrue}
                    onChange={this.onManufacturerChange}
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {manufacturers.map(manufacturer => (
                        <Option key={manufacturer}>{manufacturer}</Option>
                    ))}
                </Select>
                    })()
                }
                    
                </Form.Item>

                <Form.Item
                    form={this.props.form}
                    label="Model"
                    name="model"
                    initialValue={_.has(this.props.formData, 'model') ? this.props.formData.model : undefined}
                    rules={[
                        {
                          required: true,
                          message: "Field is empty",
                        },
                        () => ({
                            validator(rules,value = " "){
                            if (!(value)) {
                                return Promise.reject('Please select a valid model.');
                            }
                            else{
                                    return Promise.resolve();
                                }
                              
                            
                        }
                         
                        })
                      ]}
                    >
                    {(()=>{
                    return <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Select Model"
                    optionFilterProp="children"
                    onBlur={this.makeSelectStateFalse}
                    onFocus={this.makeSelectStateTrue}
                    onChange={this.onModelChange}
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {models.map(model => (
                        <Option key={model}>{model}</Option>
                    ))}
                </Select>

                    })()
                }  
                </Form.Item>

                <Form.Item
                    form={this.props.form}
                    label="Hub Height"
                    name="hubHeight"
                    initialValue={_.has(this.props.formData, 'hubHeight') ? this.props.formData.hubHeight : undefined}
                    rules={[
                        {
                          required: true,
                          message: "Field is empty",
                        },
                        () => ({
                            validator(rules,value = " "){
                            if (!(value)) {
                                return Promise.reject('Please select a valid hub height.');
                            }
                            else{
                                    return Promise.resolve();
                                }
                              
                            
                        }
                         
                        })
                      ]}
                    >
                    {(()=>{
                    return <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Select Hub Height"
                    optionFilterProp="children"
                    onBlur={this.makeSelectStateFalse}
                    onFocus={this.makeSelectStateTrue}
                    onChange={this.onHubHeightChange}
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {hubHeights.map(hubHeight => (
                        <Option key={hubHeight}>{hubHeight}</Option>
                    ))}

                </Select>
                    })()
                }
                   
                </Form.Item>

                <Form.Item
                    form={this.props.form}
                    label="Rated Power"
                    name="ratedPower"
                    initialValue={_.has(this.props.formData, 'ratedPower') ? this.props.formData.ratedPower : undefined}
                    rules={[
                        {
                          required: true,
                          message: "Field is empty",
                        },
                        () => ({
                            validator(rules,value = " "){
                            if (!value) {
                                return Promise.reject('Please select a valid Rated Power.');
                            }
                            else{
                                    return Promise.resolve();
                                }
                              
                            
                        }
                         
                        })
                      ]}
                    >
                    {(()=>{
                    return <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Select Rated Power"
                    optionFilterProp="children"
                    onBlur={this.makeSelectStateFalse}
                    onFocus={this.makeSelectStateTrue}
                    onChange={this.onRatedPowerChange}
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {ratedPowers.map(ratedPower => (
                        <Option key={ratedPower}>{ratedPower}</Option>
                    ))}

                </Select>
                    })()
                }
                    
                </Form.Item>

                <Form.Item
                    form={this.props.form}
                    label="Lastgang"
                    name="lastgang"
                    initialValue={_.has(this.props.formData, 'lastgang') ? this.props.formData.lastgang : undefined}
                    rules={[
                        {
                          required:false,
                          message: "Field is empty"
                        }
                      ]}
                    >
                    {(()=>{
                    return <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Select Lastgang"
                    optionFilterProp="children"
                    allowClear={true}
                    onBlur={this.makeSelectStateFalse}
                    onFocus={this.makeSelectStateTrue}
                    onChange={this.onLastgangChange}
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
                <Form.Item
                    form={this.props.form}
                    label="Type"
                    name="type"
                    initialValue={_.has(this.props.formData, 'type') ? this.props.formData.type : undefined}
                    rules={[
                        {
                          required: true,
                          message: "Field is empty",
                        },
                        () => ({
                            validator(rules,value = " "){
                            if (!value) {
                                return Promise.reject('Please select a valid type.');
                            }
                            else{
                                    return Promise.resolve();
                                }
                              
                            
                        }
                         
                        })
                      ]}
                    >
                    {(()=>{
                    return <Select
                    style={{ width: '100%' }}
                    placeholder="Select type"
                    onBlur={this.makeSelectStateFalse}
                    onFocus={this.makeSelectStateTrue}
                    onChange={this.makeSelectStateFalse}
                >
                    <Option value="Onshore">Onshore</Option>
                    <Option value="Offshore">Offshore</Option>
                </Select>
                    })()
                }
                </Form.Item>

                <Form.Item
                    form={this.props.form}
                    label="Noise Reduction"
                    name="noiseReduction"
                    initialValue={_.has(this.props.formData, 'noiseReduction') ? this.props.formData.noiseReduction :false}
                    valuePropName= 'checked'
                    checked={this.props.formData.noiseReduction}
                    rules={[
                        {
                          required: false,
                          message: "Field is empty",
                        },
                        () => ({
                            validator(rules,value = " "){
                            if ((typeof (value) !== "boolean")) {
                                return Promise.reject('Selection is not boolean');
                            }
                            else{
                                    return Promise.resolve();
                                }
                              
                            
                        }
                         
                        })
                      ]}
                    >
                    {(()=>{
                    return <Checkbox
                    onChange={(event)=>this.toggleNoiseReduction(event)} >
                </Checkbox>
                    })()
                }
                </Form.Item>
                <Form.Item
                    form={this.props.form}
                    label="From: "
                    name="wka_startschall"
                    id="wka_startschall"
                    initialValue={_.has(this.props.formData, 'wka_startschall') ? this.props.formData.wka_startschall : null}
                    style={this.state.isNoiseReductionTrue ? { display: '' } : { display: 'none' }}
                    rules={[
                        {
                          required: this.state.isNoiseReductionTrue,
                          message: "Field is empty"
                        }
                      ]}
                    >
                    {(()=>{
                    return <Select
                    showSearch
                    style={{ width: 200 }}
                    optionFilterProp="children"
                    onBlur={this.makeSelectStateFalse}
                    onFocus={this.makeSelectStateTrue}
                    onChange={this.onCurrentNoiseReductionFromChange}
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {noiseReductionFromData.reduce((options, fromValue) => {
                        if (fromValue) {
                            options.push(<Option key={fromValue}>{fromValue}</Option>)
                        }
                        return options
                    }, [])}
                </Select>
                    })()
                }
                </Form.Item>

                <Form.Item
                    form={this.props.form}
                    label="To:"
                    name="wka_endschall"
                    id="wka_endschall"
                    initialValue={_.has(this.props.formData, 'wka_endschall') ? this.props.formData.wka_endschall : null}
                    style={this.state.isNoiseReductionTrue ? { display: '' } : { display: 'none' }}
                    rules={[
                        {
                          required: this.state.isNoiseReductionTrue,
                          message: "Field is empty",
                        }
                      ]}
                    >
                    {(()=>{
                    return <Select
                    showSearch
                    style={{ width: 200 }}
                    optionFilterProp="children"
                    onBlur={this.makeSelectStateFalse}
                    onFocus={this.makeSelectStateTrue}
                    onChange={this.onCurrentNoiseReductionToChange}
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {noiseReductionToData.reduce((options, toValue) => {
                        if (toValue) {
                            options.push(<Option key={toValue}>{toValue}</Option>)
                        }
                        return options
                    }, [])}

                </Select>
                    })()
                }    
                </Form.Item>

                <Form.Item
                    form={this.props.form}
                    label="Curtailment [kW]"
                    name="wka_reduction_schall"
                    initialValue={_.has(this.props.formData, 'wka_reduction_schall') ? this.props.formData.wka_reduction_schall : null}
                    style={this.state.isNoiseReductionTrue ? { display: '' } : { display: 'none' }}
                    rules={[
                        {
                          required: this.state.isNoiseReductionTrue,
                          message: "Field is empty",
                        },
                        ()=>({
                            validator:(rule, value='')=>{
                            debugger
                            if(value=='')
                              return Promise.resolve()
                            if(!_.isNull(value)){
                                if (!this.state.isNoiseReductionTrue) {
                                    value=null
                                    return Promise.resolve();
                                }
                                else {
                                    if (this.formRef.current.getFieldValue('ratedPower') === undefined ){
                                        return Promise.reject(`Please enter a value for rated power`);
                                         
                                        }
                                    else if(!isFloat(stringToNumber(value)) ||
                                        (stringToNumber(value)) > (stringToNumber(this.formRef.current.getFieldValue('ratedPower')))){
                                            return Promise.reject(`A float value less than or equal to rated power is required`);
                                        }else{
                                            return Promise.resolve()
                                        }
                                
                                }}
                            return  Promise.resolve()
                        }}
                        )
                      ]
                    }
                    >
                     <Input ref={this.inputRef}
                    placeholder="Curtailment"
                    />
                </Form.Item>
            </Form>
        )
    }
}

export default WindfarmForm
