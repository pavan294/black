import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Select, message, Form } from 'antd';

import FormComponent from '../form';
import FilterComponent from './filter';
import RunModelForm from './runModelForm';
import * as tableActionCreators from '../../../../../redux/components/pages/home/table/actions';

const { Option } = Select;
const WrappedRunModelForm = RunModelForm

class FarmOptions extends React.Component {
  constructor(props) {
    super(props)
  this.state = {
    loading: false,
    currentInput: null,
    visible: false,
    runModelVisible: false
  }
  this.formRef1=React.createRef()
};

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.props.uploadCSV(this.state.currentInput)
    this.setState({
      visible: false,
      currentInput: null
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
      currentInput: null
    });
  };

  onInputChange = (value) => {
    this.setState({
      currentInput: value
    })
  }

  getInputList = () => {
    const inputList = []
    if (this.props.inputList) {
      for (let i = 0; i < this.props.inputList.length; i++) {
        let inputOption = (this.props.inputList[i]).split('direct_sales/')[1]
        inputList.push(inputOption)
      }
      return inputList
    }
    else {
      return []
    }
  }

  getWindfarmData = (key) => {
    let data = {}
    for (let i = 0; i < this.props.windfarmData.length; i++) {
      if (this.props.windfarmData[i]._id === key) {
        data = this.props.windfarmData[i]
      }
    }
    return data
  }

  saveFormRef = runFormRef => {
    this.formRef1 = runFormRef;
  };

  start = () => {
    let form = this.formRef1.current;
    // form.validateFields((err, values) => {
    //   if (err) {
    //     return;
    //   }
      //let values = this.formRef1.current.getFieldsValue()
    form.validateFields().then((values) => {
      this.setState({ runModelVisible: false });
      this.setState({ loading: true });
      let selectedRowsData = []
      for (let i = 0; i < this.props.selectedRowKeys.length; i++) {
        selectedRowsData.push(this.getWindfarmData(this.props.selectedRowKeys[i]))
      }
      if (values["ModelOutput"] === "PPA") {
        values["contract_specs"] = {
          "trade_date": values["trade_date"].format("YYYY-MM-DD"),
          "scenario": values["scenario"]
        }
        delete values["trade_date"]
        delete values["scenario"]
        if (values["contract_specs"]["scenario"] === "ppa_threshold") {
          values["contract_specs"]["ppa_lower_price"] = values["ppa_lower_price"]
          values["contract_specs"]["ppa_upper_price"] = values["ppa_upper_price"]
        } else {
          if (values["ppa_fair_price"] === 0 || values["ppa_fair_price"] === undefined) {
            values["contract_specs"]["ppa_fair_price"] = null
          } else {
            values["contract_specs"]["ppa_fair_price"] = values["ppa_fair_price"]
          }
          if (values["contract_specs"]["scenario"] !== "ppa_scenario") {
            values["contract_specs"]["ppa_monthly_output"] = values["ppa_monthly_output"]
          }
        }
        delete values["ppa_lower_price"]
        delete values["ppa_upper_price"]
        delete values["ppa_fair_price"]
        delete values["ppa_monthly_output"]
      }
      this.props.createJob(selectedRowsData, values)
      this.props.fetchJobData()
      message.loading("Job(s) sent. Waiting for approval ... ", 5)
      this.props.setPropsTable({
        jobTablesPageNumbers: {
          ...this.props.jobTablesPageNumbers,
          ...this.props.selectedRowKeys.reduce((acc, rowId) => {
            acc[rowId] = 1
            return acc
          }, {})
        }
      })
      setTimeout(() => {
        this.props.setPropsTable({ selectedRowKeys: [], selectedRowsCoordinates: [] })
        this.setState({
          loading: false,
        });
      }, 1000);
    }).catch((err) => {
      if (err) {
          return;
      }
  })
      // this.setState({ runModelVisible: false });
      // this.setState({ loading: true });
      // let selectedRowsData = []
      // for (let i = 0; i < this.props.selectedRowKeys.length; i++) {
      //   selectedRowsData.push(this.getWindfarmData(this.props.selectedRowKeys[i]))
      // }
      // if (values["ModelOutput"] === "PPA") {
      //   values["contract_specs"] = {
      //     "trade_date": values["trade_date"].format("YYYY-MM-DD"),
      //     "scenario": values["scenario"]
      //   }
      //   delete values["trade_date"]
      //   delete values["scenario"]
      //   if (values["contract_specs"]["scenario"] === "ppa_threshold") {
      //     values["contract_specs"]["ppa_lower_price"] = values["ppa_lower_price"]
      //     values["contract_specs"]["ppa_upper_price"] = values["ppa_upper_price"]
      //   } else {
      //     if (values["ppa_fair_price"] === 0 || values["ppa_fair_price"] === undefined) {
      //       values["contract_specs"]["ppa_fair_price"] = null
      //     } else {
      //       values["contract_specs"]["ppa_fair_price"] = values["ppa_fair_price"]
      //     }
      //     if (values["contract_specs"]["scenario"] !== "ppa_scenario") {
      //       values["contract_specs"]["ppa_monthly_output"] = values["ppa_monthly_output"]
      //     }
      //   }
      //   delete values["ppa_lower_price"]
      //   delete values["ppa_upper_price"]
      //   delete values["ppa_fair_price"]
      //   delete values["ppa_monthly_output"]
      // }
      // this.props.createJob(selectedRowsData, values)
      // this.props.fetchJobData()
      // message.loading("Job(s) sent. Waiting for approval ... ", 5)
      // this.props.setPropsTable({
      //   jobTablesPageNumbers: {
      //     ...this.props.jobTablesPageNumbers,
      //     ...this.props.selectedRowKeys.reduce((acc, rowId) => {
      //       acc[rowId] = 1
      //       return acc
      //     }, {})
      //   }
      // })
      // setTimeout(() => {
      //   this.props.setPropsTable({ selectedRowKeys: [], selectedRowsCoordinates: [] })
      //   this.setState({
      //     loading: false,
      //   });
      // }, 1000);
    // });
  };

  runModel = () => {
    this.setState({ runModelVisible: true })
  }

  render() {
    const { loading, visible } = this.state;
    const selectedRowKeys = this.props.selectedRowKeys
    const hasSelected = selectedRowKeys.length > 0;
    const inputList = this.getInputList()

    return (
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <div className="mr-3">
            <FormComponent
              farmType={this.props.farmType}
            />
          </div>
          <div className="mr-3 mb-4">
            <Button type='primary' onClick={this.showModal}>
              Upload CSV
            </Button>
            <Modal
              visible={visible}
              title="Upload File"
              okText={"Save"}
              onCancel={this.handleCancel}
              onOk={this.handleOk}>
              <Select
                showSearch
                style={{ width: 470 }}
                placeholder="Select file"
                optionFilterProp="children"
                onChange={this.onInputChange}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {inputList.map(input => (
                  <Option key={input}>{input}</Option>
                ))}
              </Select>
            </Modal>
          </div>
          <div span={3} offset={1} className="mb-4 mr-3">
            <Button type="primary" onClick={this.runModel} disabled={!hasSelected} loading={loading}>
              Run Model
            </Button>
          </div>
          <div span={3} offset={1} style={{ lineHeight: 2 }} className="mb-4">
            <span id="selectedItemsCount">
              {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
            </span>
          </div>
        </div>
        <div span={12}>
          <FilterComponent />
        </div>
        <WrappedRunModelForm
          reference1={this.saveFormRef}
          isRunModelVisible={this.state.runModelVisible}
          start={this.start}
          onRunModelCancel={() => {
            this.setState({
              runModelVisible: false
            })
          }}
        />
      </div >
    );
  }
}

const mapStateToProps = (state) => {
  return {
    jobTablesPageNumbers: state.home.table.jobTablesPageNumbers
  }
}

const mapDispatchToProps = {
  createJob: tableActionCreators.createJob
}

export default connect(mapStateToProps, mapDispatchToProps)(FarmOptions);
