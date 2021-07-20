import React, { Component } from 'react'
import { Marker, Popup } from "react-leaflet";
import { Modal} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import _ from 'lodash'
import * as tableActionCreators from '../../../../../redux/components/pages/home/table/actions'
import * as mapActionCreators from '../../../../../redux/components/pages/home/map/actions'

class MarkerComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            marker: this.props.position,
            confirmModalVisible: false,
            newLatLng: [],
            mapKey: Math.random()
        }
    }

    showModal = () => {
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            confirmModalVisible: false
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            confirmModalVisible: false,
        });
    };

    componentDidMount() {
        this.setState({
            marker: this.props.position
        })
    }

    componentDidUpdate() {
        if (!_.isEqual(this.props.position, this.state.marker)) {
            this.setState({
                marker: this.props.position
            })
        }
    }

    onDragged = (args) => {
        const new_latitude = _.toString(args.target._latlng.lat)
        const new_longitude = _.toString(args.target._latlng.lng)
        Modal.confirm({
            title: "Do you wish to change the co ordinates of the current selected farm?",
            icon: <ExclamationCircleOutlined />,
            onOk: () => {
                let farms = _.filter(this.props.windfarmData, { latitude: this.state.marker[0], longitude: this.state.marker[1] })
                let coords_updated = false
                farms.forEach(farm => {
                    this.props.patchRow(farm._id, { ...farm, latitude: new_latitude, longitude: new_longitude }, () => {
                        if (_.isEqual(this.props.lastSelectedPostion, [this.state.marker[0], this.state.marker[1]])) {
                            this.props.onUpdateLastSelectedPosition(new_latitude, new_longitude)
                        }
                        if (!coords_updated) {
                            let selectedRowsCoordinates = _.cloneDeep(this.props.selectedRowsCoordinates)
                            let removed_element = _.remove(selectedRowsCoordinates, (coord) => { return _.isEqual(coord, [this.state.marker[0], this.state.marker[1]]) })
                            if (removed_element.length) {
                                selectedRowsCoordinates.push([new_latitude, new_longitude])
                                this.props.setPropsTable({
                                    selectedRowsCoordinates
                                })
                            }
                            coords_updated = true
                        }
                        this.setState({
                            marker: [new_latitude, new_longitude]
                        })
                    }).catch(e => {
                        this.setState({
                            mapKey: Math.random()
                        })
                    })
                })
            },
            onCancel: () => {
                this.setState({
                    mapKey: Math.random()
                })
            },
        });
    }

    render() {
        return (
            <Marker key={this.state.mapKey} draggable={this.props.draggable ? true : false} onDragEnd={this.onDragged} position={this.state.marker} icon={this.props.icon}>
                <Popup>
                    <div>
                        Lat : {this.state.marker[0]} <br />
                        Lng : {this.state.marker[1]}
                    </div>
                </Popup>
            </Marker>
        )
    }
}

const mapStateToProps = state => {
    return {
        selectedRowKeys: state.home.table.selectedRowKeys,
        lastSelectedPostion: state.home.map.lastSelectedPostion,
        windfarmData: state.home.table.windfarmData,
        selectedRowsCoordinates: state.home.table.selectedRowsCoordinates
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onUpdateLastSelectedPosition: (latitude, longitude) => dispatch(mapActionCreators.onUpdateLastSelectedPosition(latitude, longitude)),
        fetchWindfarmData: (cb) => dispatch(tableActionCreators.fetchWindfarmData(cb)),
        patchRow: (doc_id, doc, cb) => dispatch(tableActionCreators.patchRow(doc_id, doc, cb)),
        setPropsTable: payload => dispatch(tableActionCreators.setProps(payload))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MarkerComponent);
