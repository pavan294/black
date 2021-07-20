import React, { Component } from 'react'
import { Form, DatePicker, Select } from 'antd';
import { connect } from "react-redux";
import "./index.css";
import _ from 'lodash'
import * as tableActionCreators from '../../../../../redux/components/pages/home/table/actions'

const { Option } = Select;

export class FilterComponent extends Component {
    onDateChange = (date, dateString) => {
        let tableFilters = _.cloneDeep(this.props.tableFilters)
        if (dateString) {
            tableFilters.date_added = dateString
        } else {
            tableFilters = _.omit(tableFilters, "date_added")
        }
        this.props.updateTableFilters(tableFilters)
    }
    onAuthorChange = (value) => {
        let tableFilters = _.cloneDeep(this.props.tableFilters)
        if (value) {
            tableFilters.author = value
        } else {
            tableFilters = _.omit(tableFilters, "author")
        }
        this.props.updateTableFilters(tableFilters)
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 18 },
                sm: { span: 16 },
            },
        };
        return (
            < Form className="float-right" layout="inline" {...formItemLayout}>
                <Form.Item label="Author">
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Select Author"
                        onChange={this.onAuthorChange}
                        allowClear={true}
                    >
                        {this.props.windfarmData && [...new Set(_.map(this.props.windfarmData, "author"))].map(author => (
                            <Option key={author} value={author}>{author}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Date Added">
                    <DatePicker onChange={this.onDateChange} />
                </Form.Item>
            </Form >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        windfarmData: state.home.table.windfarmData,
        tableFilters: state.home.table.tableFilters
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateTableFilters: (filter) => dispatch(tableActionCreators.updateTableFilters(filter)),
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(FilterComponent);
