import React from 'react'
import moment from 'moment';
import { connect } from "react-redux";
import { Table,Button, Input } from 'antd';
import {PauseCircleOutlined,CheckCircleOutlined,CloseCircleOutlined,ClockCircleOutlined} from '@ant-design/icons';
import _ from 'lodash'
import Highlighter from 'react-highlight-words';

import FarmOptions from './options';
import * as formActionCreators from '../../../../../redux/components/pages/home/form/actions'
import * as tableActionCreators from '../../../../../redux/components/pages/home/table/actions'
import * as mapActionCreators from '../../../../../redux/components/pages/home/map/actions'
import './index.css'


const JOB_FINISHED_STATUS = ["Succeeded", "Failed", "Unknown"]

// const saveData = (function () {
//   const a = document.createElement("a");
//   document.body.appendChild(a);
//   a.style = "display: none";
//   return function (data, fileName) {
//     let output_data = data
//     if (typeof data === "object") {
//       output_data = JSON.stringify(data)
//     }
//     else if (typeof data === "string") {
//       output_data = JSON.parse(JSON.stringify(data))
//     }
//     const blob = new Blob([output_data], { type: "octet/stream" })
//     const url = window.URL.createObjectURL(blob)
//     a.href = url;
//     a.download = fileName;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };
// }());

class NestedJobTable extends React.Component {
  render() {
    const columns = this.props.createJobColumns(this.props.actions)
    const data = []
    for (let i = 0; i < this.props.jobData.length; i++) {
      if (this.props.jobData[i].deal_id.includes(this.props.record.key)) {
        let row = {}
        row["key"] = i
        try {
          row["date"] = moment(this.props.jobData[i].timestamp).format('MMMM Do YYYY, h:mm:ss a');
          row["job_id"] = this.props.jobData[i].job_id
          if (this.props.jobData[i].status === "Pending") {
            row["status"] = <PauseCircleOutlined theme="twoTone" twoToneColor="orange" style={{ fontSize: '20px' }} />
          }
          else if (this.props.jobData[i].status === "Succeeded") {
            row["status"] = <CheckCircleOutlined theme="twoTone" twoToneColor="limegreen" style={{ fontSize: '20px' }} />
          }
          else if (this.props.jobData[i].status === "Failed") {
            row["status"] = <CloseCircleOutlined theme="twoTone" twoToneColor="red" style={{ fontSize: '20px' }} />
          }
          else if (this.props.jobData[i].status === "Running") {
            row["status"] = <ClockCircleOutlined  theme="twoTone" twoToneColor="orange" style={{ fontSize: '20px' }} />
          }
        }
        catch (e) {
          console.log(e)
        }
        data.push(row)
      }
    }

    data.sort((a, b) => new Date(moment(b.date, 'MMMM Do YYYY, h:mm:ss a').toISOString()).getTime() - new Date(moment(a.date, 'MMMM Do YYYY, h:mm:ss a').toISOString()).getTime())
    return (
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 3, current: this.props.currentPage }}
        onChange={pagination => this.props.onChange(pagination, this.props.index)}
      />
    )
  }
}


class TableComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currentInput: null,
      visible: false,
      searchText: '',
      searchedColumn: '',
      filteredInfo: {}
    };
  }

  componentDidMount() {
    this.props.fetchJobData()
    let timer_5s = setInterval(this.tick_5s, 5000);
    let timer_1s = setInterval(this.tick_1s, 1000);
    this.setState({ timer_1s });
    this.setState({ timer_5s });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.farmType !== this.props.farmType) {
      this.setState({
        searchText: '',
        searchedColumn: '',
        filteredInfo: {}
      })
      this.props.setPropsTable({
        selectedRowKeys: [],
        windfarmData: [],
        selectedRowsCoordinates: [],
        currentPageNumber: 1,
      })
    }
    if (prevProps.tableFilters !== this.props.tableFilters) {
      this.props.setPropsTable({
        selectedRowKeys: [],
        selectedRowsCoordinates: []
      })
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.timer_1s);
    clearInterval(this.state.timer_5s);
  }

  tick_1s = () => {
    this.props.fetchWindfarmData()
    this.props.fetchTurbineData()

  }

  tick_5s = () => {
    for (let i = 0; i < this.props.jobData.length; i++) {
      if (!this.props.jobData[i].is_deleted) {
        if (JOB_FINISHED_STATUS.indexOf(this.props.jobData[i].status) >= 0) {

          console.log("Deleting job ", this.props.jobData[i].job_id, "with status ", this.props.jobData[i].status)
          this.props.deleteJob(this.props.jobData[i].job_id)
        }
        this.props.updateJobStatus(this.props.jobData[i].job_id)
      }
    }
    this.props.fetchJobData()
    this.props.fetchLastgangData()
    this.props.fetchInputList()
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.props.setPropsTable({
      selectedRowKeys,
      selectedRowsCoordinates: selectedRows.map(row => [row.latitude, row.longitude])
    })
  }

  editWindfarm = (formData) => {
    this.props.updateModalHeader(`Edit ${this.props.farmType}`)
    this.props.setModalVisibleTrue(formData)
  }

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      filteredInfo: {
        ...this.state.filteredInfo,
        [dataIndex]: selectedKeys
      }
    })
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  handleChange = (pagination, filters) => {
    this.setState({
      filteredInfo: filters,
    });
    this.props.setPropsTable({
      currentPageNumber: pagination['current']
    })
  };

  getColumnSearchProps = (dataIndex) => {
    const filteredValue = this.state.filteredInfo && this.state.filteredInfo[dataIndex] ? this.state.filteredInfo[dataIndex] || null : null
    return {
      filteredValue,
      filterDropdown: ({ confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={node => {
              this.searchInput = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={this.state.searchText[0]}
            onChange={e => {
              this.setState({
                searchText: e.target.value ? [e.target.value] : [],
                searchedColumn: dataIndex
              })
            }}
            onPressEnter={() => this.handleSearch(this.state.searchText, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => this.handleSearch(this.state.searchText, confirm, dataIndex)}
            // icon={<SearchOutline />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </div>
      ),
      // filterIcon: filtered => <SearchOutline style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) => {
        const cellValue = record[dataIndex]
        if (!cellValue) {
          return false
        }
        return record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
      },
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => this.searchInput.select());
        }
      },
      render: text =>
        this.state.searchedColumn === dataIndex && text ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={filteredValue || []}
            autoEscape
            textToHighlight={text.toString()}
          />
        ) : (
            text
          ),
    }
  };

  updateLatLong = (latitude, longitude) => {
    if (latitude && longitude) {
      this.props.onUpdateLatLng(latitude, longitude)
      this.props.onUpdateLastSelectedPosition(latitude, longitude)
    }
  }

  deleteFarm = (doc_id) => {
    this.props.deleteRow(doc_id)
    let updatedSelectedRowKeys = _.cloneDeep(this.props.selectedRowKeys)
    let updatedSelectedRowCoordinates = []
    _.remove(updatedSelectedRowKeys, (row) => { return row === doc_id })
    updatedSelectedRowKeys.forEach(row_id => {
      let farm = _.filter(this.props.windfarmData, { _id: row_id })
      farm.forEach(row => {
        updatedSelectedRowCoordinates.push([row.latitude, row.longitude])
      })
    })
    this.props.setPropsTable({
      selectedRowKeys: updatedSelectedRowKeys,
      selectedRowsCoordinates: updatedSelectedRowCoordinates
    })
  }

  handleJobPageChange = (pagination, index) => {
    this.props.setPropsTable({
      jobTablesPageNumbers: {
        ...this.props.jobTablesPageNumbers,
        [index]: pagination.current
      }
    })
  };

  expandedRowRender = record => {
    const jobTableActions = [this.props.fetchJobInput, this.props.fetchJobOutput, this.props.fetchJobLogs]
    if (!this.props.jobTablesPageNumbers[record._id]) {
      this.props.setPropsTable({
        jobTablesPageNumbers: {
          ...this.props.jobTablesPageNumbers,
          [record._id]: 1
        }
      })
    }
    return (
      <div>
        <NestedJobTable
          record={record}
          index={record._id}
          jobData={this.props.jobData}
          actions={jobTableActions}
          createJobColumns={this.props.createJobColumns}
          onChange={this.handleJobPageChange}
          currentPage={this.props.jobTablesPageNumbers[record._id]}
        />
      </div>
    )
  };

  render() {
    const selectedRowKeys = this.props.selectedRowKeys
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const data = [];
    for (let i = this.props.windfarmData.length - 1; i >= 0; i--) {
      let isSameAuthor = _.has(this.props.tableFilters, "author") && this.props.tableFilters.author === this.props.windfarmData[i].author
      let isSameDay = _.has(this.props.tableFilters, "date_added") && moment(this.props.windfarmData[i].date_added).isSame(this.props.tableFilters.date_added, 'day')
      if (_.isEmpty(this.props.tableFilters) || isSameAuthor || isSameDay) {
        if (_.has(this.props.tableFilters, "author") && _.has(this.props.tableFilters, "date_added") && !(isSameAuthor && isSameDay)) {
          continue
        }
        let row = { ...this.props.windfarmData[i] }
        row['key'] = this.props.windfarmData[i]._id
        data.push(row);
      }
    }

    const actions = [this.updateLatLong, this.editWindfarm, this.deleteFarm]

    const columns = this.props.createColumns(actions, this.getColumnSearchProps)

    return (
      <div>
        <FarmOptions
          uploadCSV={this.props.uploadCSV}
          inputList={this.props.inputList}
          selectedRowKeys={this.props.selectedRowKeys}
          windfarmData={this.props.windfarmData}
          fetchJobData={this.props.fetchJobData}
          setPropsTable={this.props.setPropsTable}
          farmType={this.props.farmType}
        />
        <Table
          pagination={{ current: this.props.currentPageNumber }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          expandedRowRender={this.expandedRowRender}
          onChange={this.handleChange}
        />
      </div>

    );
  }
}

const mapStateToProps = (state) => {
  return {
    windfarmData: state.home.table.windfarmData,
    jobData: state.home.table.jobData,
    inputList: state.home.table.inputList,
    tableFilters: state.home.table.tableFilters,
    selectedRowKeys: state.home.table.selectedRowKeys,
    currentPageNumber: state.home.table.currentPageNumber,
    jobTablesPageNumbers: state.home.table.jobTablesPageNumbers,
    state: state
  };
};

const mapDispatchToProps = dispatch => {
  return {

    onUpdateLatLng: (latitude, longitude) => dispatch(mapActionCreators.onUpdateLatLng(latitude, longitude)),
    onUpdateLastSelectedPosition: (latitude, longitude) => dispatch(mapActionCreators.onUpdateLastSelectedPosition(latitude, longitude)),
    setModalVisibleTrue: (formData) => dispatch(formActionCreators.setModalVisibleTrue(formData)),
    updateModalHeader: (header) => dispatch(formActionCreators.updateModalHeader(header)),
    postRow: (doc) => dispatch(tableActionCreators.postRow(doc)),
    patchRow: (doc_id, doc) => dispatch(tableActionCreators.patchRow(doc_id, doc)),
    deleteRow: (doc_id) => dispatch(tableActionCreators.deleteRow(doc_id)),
    createJob: (input) => dispatch(tableActionCreators.createJob(input)),
    updateJobStatus: (job_id) => dispatch(tableActionCreators.updateJobStatus(job_id)),
    deleteJob: (job_id) => dispatch(tableActionCreators.deleteJob(job_id)),
    fetchWindfarmData: () => dispatch(tableActionCreators.fetchWindfarmData()),
    fetchTurbineData: () => dispatch(tableActionCreators.fetchTurbineData()),
    fetchJobData: () => dispatch(tableActionCreators.fetchJobData()),
    uploadCSV: (file) => dispatch(tableActionCreators.uploadCSV(file)),
    fetchLastgangData: () => dispatch(tableActionCreators.fetchLastgangData()),
    fetchInputList: () => dispatch(tableActionCreators.fetchInputList()),
    fetchJobOutput: (job_id) => dispatch(tableActionCreators.fetchJobOutput(job_id)),
    fetchJobInput: (job_id) => dispatch(tableActionCreators.fetchJobInput(job_id)),
    fetchJobLogs: (job_id) => dispatch(tableActionCreators.fetchJobLogs(job_id)),
    setPropsTable: payload => dispatch(tableActionCreators.setProps(payload))

  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TableComponent);
