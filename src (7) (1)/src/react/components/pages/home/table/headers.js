import React from 'react';
import { Button, Divider } from 'antd';
import 'antd/dist/antd.css';

import { WINDFARM, SOLARFARM } from '../../../../../constants';

const renderActions = (text, record, actions) => {
  return (
    <span>
      <Button className="action-button" type='link' onClick={() => actions[0](record.latitude, record.longitude)}>Position</Button>
      <Divider type="vertical" />
      <Button className="action-button" type='link' onClick={() => actions[1](record)}>Edit</Button>
      <Divider type="vertical" />
      <Button className="action-button" type='link' onClick={() => actions[2](record.key)}>Delete</Button>
    </span>
  );
}


function createWindfarmColumns(actions, getColumnSearchProps) {
  return [
    {
      title: 'Latitude',
      dataIndex: 'latitude',
    }, {
      title: 'Longitude',
      dataIndex: 'longitude',
    }, {
      title: 'Project',
      dataIndex: 'project',
      key: 'project',
      ...getColumnSearchProps('project')
    }, {
      title: 'Turbines',
      dataIndex: 'turbines',
    }, {
      title: 'Manufacturer',
      dataIndex: 'manufacturer',
    }, {
      title: 'Model',
      dataIndex: 'model',
    }, {
      title: 'Hub Height',
      dataIndex: 'hubHeight',
    }, {
      title: 'Lastgang',
      dataIndex: 'lastgang',
    }, {
      title: 'Type',
      dataIndex: 'type',
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record) => renderActions(text, record, actions)
    }
  ];
}


function createSolarfarmColumns(actions, getColumnSearchProps) {
  return [
    {
      title: 'Latitude',
      dataIndex: 'latitude',
    }, {
      title: 'Longitude',
      dataIndex: 'longitude',
    }, {
      title: 'Project',
      dataIndex: 'project',
      key: 'project',
      ...getColumnSearchProps('project')
    }, {
      title: 'DC/AC Capacity',
      dataIndex: 'acdc_capacity',
    }, {
      title: 'Actual Source',
      dataIndex: 'actual_source',
    }, {
      title: 'PV Panel',
      dataIndex: 'pv_panel',
    }, {
      title: 'PV Azimuth',
      dataIndex: 'pv_azimuth',
    }, {
      title: 'PV Tilt',
      dataIndex: 'pv_tilt',
    }, {
      title: 'Rated Capacity',
      dataIndex: 'rated_capacity',
    }, {
      title: 'Unit Power',
      dataIndex: 'unit_power',
    }, {
      title: 'Unit Production',
      dataIndex: 'unit_production',
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record) => renderActions(text, record, actions)
    }
  ];
}

export const createJobColumns = (actions) => {
  return [
    {
      title: 'Date',
      dataIndex: 'date',
    }, {
      title: 'Job Id',
      dataIndex: 'job_id',
    }, {
      title: 'Status',
      dataIndex: 'status',
    }, {
      title: 'Data',
      key: 'data',
      render: (text, record) => (
        <span>
          <Button className="action-button" type='link' onClick={() => actions[0](record['job_id'])}>Input</Button>
          <Divider type="vertical" />
          <Button className="action-button" type='link' onClick={() => actions[1](record['job_id'])}>Output</Button>
          <Divider type="vertical" />
          <Button className="action-button" type='link' onClick={() => actions[2](record['job_id'])}>Logs</Button>
        </span>
      ),
    }
  ];
}

export const farmColumns = {
  [WINDFARM]: createWindfarmColumns,
  [SOLARFARM]: createSolarfarmColumns
}
