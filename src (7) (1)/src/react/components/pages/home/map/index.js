import React from "react";
import { connect } from "react-redux";
import Leaflet from "leaflet";
import {Map, TileLayer, Popup } from "react-leaflet";
import ReactLeafletSearch from "react-leaflet-search";
import _ from "lodash";
import Marker from './marker';
import * as actionCreators from "../../../../../redux/components/pages/home/map/actions";
import farmIconPaths from "./farmIconPaths";
import "leaflet/dist/leaflet.css";
import "./index.css";


class MapComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mapZoom: 12,
            selectedRowsCoordinates: []
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.farmType !== this.props.farmType) {
            this.props.resetLastSelectedPosition()
        }
        if (!_.isEqual(prevProps.selectedRowsCoordinates, this.props.selectedRowsCoordinates)) {
            this.setState({
                selectedRowsCoordinates: this.props.selectedRowsCoordinates
            })
        }
    }

    handleClick = e => {
        console.log(e)
        this.props.onUpdateLatLng(e.latlng.lat, e.latlng.lng);
    };

    handlePopupChange = e => {
        this.props.onUpdateLatLng(e.popup._latlng.lat, e.popup._latlng.lng);
    };

    customPopup(SearchInfo) {
        let pos = SearchInfo.latLng.toString().replace("LatLng(", "");
        pos = pos.replace(")", "");
        pos = pos.trim().split(",");
        const latlng = { lat: pos[0], lng: pos[1] };
        return (
            <Popup>
                <div>
                    Lat : {latlng.lat}
                    <br />
          Lng : {latlng.lng}
                </div>
            </Popup>
        );
    }

    isActivePostionSelected = () => {
        let isSelected = false
        if (this.props.lastSelectedPostion) {
            for (let i = 0; i < this.state.selectedRowsCoordinates.length; i++) {
                if (this.props.lastSelectedPostion[0] === this.state.selectedRowsCoordinates[i][0] && this.props.lastSelectedPostion[1] === this.state.selectedRowsCoordinates[i][1]) {
                    isSelected = true
                    break
                }
            }
        }
        return isSelected
    }

    getUniqueSelectedBounds = () => {
        let bounds = []
        this.state.selectedRowsCoordinates.forEach(coordinate => {
            if (!bounds.some(a => coordinate.every((value, index) => value === a[index]))) {
                bounds.push(coordinate)
            }
        })
        return bounds
    }

    handleZoomStart = e => {
        console.log("e", e)
        this.setState({ mapZoom: e.target._zoom })
    }

    render() {
        let position = [this.props.latitude, this.props.longitude];
        let farmMarker = Leaflet.icon({
            iconUrl: farmIconPaths[this.props.farmType]
        });
        Leaflet.Marker.prototype.options.icon = farmMarker;
        let farmMarkerGreen = Leaflet.icon({
            iconUrl: farmIconPaths[`${this.props.farmType}-green`]
        });
        Leaflet.Marker.prototype.options.icon = farmMarkerGreen;
        let fitBounds = {}
        if (this.getUniqueSelectedBounds().length > 1) {
            fitBounds.bounds = this.getUniqueSelectedBounds()
        } else if (this.getUniqueSelectedBounds().length === 1) {
            if (_.isEqual(position, this.getUniqueSelectedBounds()[0])) {
                position = this.getUniqueSelectedBounds()[0]
            } else {
                fitBounds.bounds = [position, this.getUniqueSelectedBounds()[0]]
            }
        }
        return (
            <div style={{ textAlign: "center" }}>
                <Map
                    animate
                    center={position}
                    length={4}
                    onClick={this.handleClick}
                    onZoomEnd={this.handleZoomStart}
                    // onPopupOpen={this.handlePopupChange}
                    zoom={this.state.mapZoom}
                    maxZoom={19}
                    style={{ height: "600px" }}
                    {...fitBounds}
                >
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {this.state.selectedRowsCoordinates.map(marker => {
                        return (
                            <Marker key={marker} draggable={true} position={marker} icon={farmMarker} />
                        );
                    })}
                    {
                        this.props.lastSelectedPostion && 
                        <Marker position={[this.props.lastSelectedPostion[0], this.props.lastSelectedPostion[1]]} draggable={true} icon={farmMarkerGreen} />

                    }

                    <ReactLeafletSearch
                        position="topleft"
                        search={[position.lat, position.lng]}
                        inputPlaceholder="Please enter an address"
                        showMarker={true}
                        zoom={13}
                        openSearchOnLoad={false}
                        closeResultsOnClick={true}
                        popUp={this.customPopup}
                    />
          ;
        </Map>
            </div >
        );
    }
}

const mapStateToProps = state => {
    return {
        latitude: state.home.map.latitude,
        longitude: state.home.map.longitude,
        lastSelectedPostion: state.home.map.lastSelectedPostion,
        selectedRowsCoordinates: state.home.table.selectedRowsCoordinates
    };
};

const mapDispatchToProps = {
    onUpdateLatLng: actionCreators.onUpdateLatLng,
    resetLastSelectedPosition: actionCreators.resetLastSelectedPosition
};

export default connect(mapStateToProps, mapDispatchToProps)(MapComponent);
