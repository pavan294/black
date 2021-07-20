import React, { Component } from 'react'
import { Form,Select, Modal, DatePicker, InputNumber } from 'antd';
import moment from "moment-timezone";
const { Option } = Select;
export class RunModelForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modelOutput: "PPA",
            scenario: "ppa_scenario"
        }
        this.formRef1=React.createRef()
    }
    componentDidMount() {
        this.props.reference1(this.formRef1)
      }
    componentWillMount() {
        this.props.reference1(this.formRef1)
      }
    onModelOutputChange = (modelOutput) => {
        this.setState({ modelOutput })
    }

    onScenarioChange = (scenario) => {
        this.setState({ scenario })
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 12 },
                sm: { span: 16 },
            },
        };
        return (
            <Modal
                visible={this.props.isRunModelVisible}
                title="Run Model"
                okText="Run"
                onCancel={this.props.onRunModelCancel}
                onOk={this.props.start}
                destroyOnClose={true}
            >
                <Form ref={this.formRef1} {...formItemLayout} className="run-model-form">
                    <Form.Item
                        form={this.props.form}
                        label="Model Output"
                        decoratorString="ModelOutput"
                        name="ModelOutput"
                        initialValue="PPA"
                        // required={true}
                        // message="Field is empty"
                        // validatorCondition={value => !(value)}
                        // validatorErrorMessage='Please select a valid Model Output.'
                        // formEl={<Select value="PPA" style={{ width: '100%' }} onChange={this.onModelOutputChange}>
                        //     <Option value="PPA">PPA</Option>
                        //     <Option value="DV">DV</Option>
                        //     <Option value="normalprofil">Normal Profil</Option>
                        // </Select>}
                        rules={[
                            {
                              required: true,
                              message: "Field is Empty",
                            },
                            () => ({
                                validator(rules,value = " "){
                                if (!value) {
                                     return Promise.reject("Please select a valid Model Output.")

                                }
                                else{
                                        return Promise.resolve();
                                    }
                                  }
                             })
                              ]
                        }
                        >
                    {(()=>{
                      return <Select value="PPA" style={{ width: '100%' }} onChange={this.onModelOutputChange}>
                      <Option value="PPA">PPA</Option>
                      <Option value="DV">DV</Option>
                      <Option value="normalprofil">Normal Profil</Option>
                  </Select>
                    })()
                }
                        
                    </Form.Item>
                    {
                        this.state.modelOutput === "PPA" ?
                            <>
                                <Form.Item
                                    form={this.props.form}
                                    label="HPFC Settlement Date"
                                    name="trade_date"
                                    decoratorString="trade_date"
                                    initialValue={moment().tz("Europe/Berlin")}
                                    // required={true}
                                    // message="Field is mandatory"
                                    // validatorCondition={value => !(value)}
                                    // validatorErrorMessage='Please select a valid HPFC Settlement Date.'
                                    //formEl={<DatePicker style={{ width: "100%" }} />}
                                    rules={[
                                        {
                                          required: true,
                                          message: "Field is mandatory",
                                        },
                                            () => ({
                                                validator(rules,value = " "){
                                                if (!value) {
                                                     return Promise.reject("'Please select a valid HPFC Settlement Date.")
            
                                                }
                                                else{
                                                        return Promise.resolve();
                                                    }
                                                  }
                                             })
                                         ]
                                    }
                                    >
                                {(()=>{
                                     return <DatePicker style={{ width: "100%" }} />
                    })()
                }
                                </Form.Item>
                                <Form.Item
                                    form={this.props.form}
                                    label="Scenario"
                                    decoratorString="scenario"
                                    name="scenario"
                                    initialValue="ppa_scenario"
                                    // required={true}
                                    // message="Field is empty"
                                    // validatorCondition={value => !(value)}
                                    // validatorErrorMessage='Please select a valid Scenario.'
                                    // formEl={<Select value="ppa_scenario" style={{ width: '100%' }} onChange={this.onScenarioChange}>
                                    //     <Option value="ppa_scenario">Pay as produced mit Fixpreis</Option>
                                    //     <Option value="ppa_threshold">Pay as produced mit Preisgrenzen</Option>
                                    //     <Option value="ppa_monthly_baseload">Monthly Baseload mit Fixpreis</Option>
                                    //     <Option value="ppa_monthly_peak">Monthly 7 Day Peak mit Fixpreis</Option>
                                    // </Select>}
                                    rules={[
                                        {
                                          required: true,
                                          message: "Field is Empty",
                                        }]
                                        

                                    }
                                    >
                                {(()=>{
                      return <Select value="ppa_scenario" style={{ width: '100%' }} onChange={this.onScenarioChange}>
                      <Option value="ppa_scenario">Pay as produced mit Fixpreis</Option>
                      <Option value="ppa_threshold">Pay as produced mit Preisgrenzen</Option>
                      <Option value="ppa_monthly_baseload">Monthly Baseload mit Fixpreis</Option>
                      <Option value="ppa_monthly_peak">Monthly 7 Day Peak mit Fixpreis</Option>
                  </Select>
                    })()} 
                

                                </Form.Item>
                                {
                                    this.state.scenario === "ppa_scenario" ?
                                        <Form.Item label="Fair Price" name="ppa_fair_price" rules={[{ required: false }]}>
        
                                        <InputNumber step={0.1} defaultValue={0.0} placeholder="Input Fair Price - or leave blank and let the model calculate it" style={{ width: "100%" }} />
                                        </Form.Item>
                                        : this.state.scenario === "ppa_threshold" ?
                                            <>
                                                <Form.Item label="Lower Price" name="ppa_lower_price"  rules={[{ required: true,message: "Please enter a Lower Price." }]}>
                                                    
                                                <InputNumber step={0.1} placeholder="Input Lower Price"  style={{ width: "100%" }} />
                                                </Form.Item>
                                                <Form.Item label="Upper Price" name="ppa_upper_price"  rules={[{ required: true,message: "Please enter a Upper Price." }]}>
                                                    
                                                <InputNumber step={0.1} placeholder="Input Upper Price" style={{ width: "100%" }} />
                                                </Form.Item>
                                            </>
                                            : <>
                                                <Form.Item label="Fair Price"  name="ppa_fair_price" rules={[{ required: false }]}>
                                                    
                                                <InputNumber step={0.1} defaultValue={0.0} placeholder="Input Fair Price - or leave blank and let the model calculate it" style={{ width: "100%" }} />
                                                </Form.Item>
                                                <Form.Item
                                                    form={this.props.form}
                                                    label="Monthly Output"
                                                    decoratorString="ppa_monthly_output"
                                                    name="ppa_monthly_output"
                                                    initialValue="MW"
                                                    // required={true}
                                                    // message="Field is empty"
                                                    // validatorCondition={value => !(value)}
                                                    // validatorErrorMessage='Please select a valid Monthly Output.'
                                                    // formEl={<Select value="MW" style={{ width: '100%' }}>
                                                    //     <Option value="MW">MW</Option>
                                                    //     <Option value="Quantil">Quantil</Option>
                                                    // </Select>}
                                                    rules={[
                                                        {
                                                          required: true,
                                                          message: "Field is Empty",
                                                        },
                                                            () => ({
                                                                validator(rules,value = " "){
                                                                if (!value) {
                                                                     return Promise.reject("Please select a valid Monthly Output.")
                            
                                                                }
                                                                else{
                                                                        return Promise.resolve();
                                                                    }
                                                                  }
                                                             })
                                                         ]
                                                    }
                                                    >
                                                {(()=>{
                                     return <Select value="MW" style={{ width: '100%' }}>
                                                <Option value="MW">MW</Option>
                                                <Option value="Quantil">Quantil</Option>
                                            </Select>
                                            })()}
                                                </Form.Item>
                                            </>
                                }
                            </>
                            : null
                    }
                </Form>
            </Modal>
        )
    }
}

export default RunModelForm
