import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { toast } from 'react-hot-toast';
import '../index.css';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Layout from '../components/Layout';
import { CalendarOutlined, CompassOutlined, FacebookOutlined, InstagramOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const containerStyle = {
  width: '500px',
  height: '500px',
};


function Location() {
  const dispatch = useDispatch();
  const [locations, setLocation] = useState([]);

  const getLocationData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get('/api/user/location', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setLocation(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error('An error occurred while fetching location data');
    }
  };

  useEffect(() => {
    getLocationData();
  }, []);

  const mapRef = React.useRef(null);
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
    const bounds = new window.google.maps.LatLngBounds();
    locations.forEach((location) => {
      bounds.extend(new window.google.maps.LatLng(location.latitude, location.longitude));
    });
    map.fitBounds(bounds);
  }, [locations]);

  return (
    <Layout>
      <div className="location-container">
        {locations.map((location) => (
          <div key={location._id} className="location-item">
            <div className="location-info">
              <h1 className="heading">{location.name}</h1>
              <hr />
              <CompassOutlined className="icons" />
              <p className="custom-text2">{location.address}</p>
              <p className="custom-text2">{location.localitate}</p>
              <p className="custom-text2">{location.tara}</p>
              <hr />
              <div>
                <PhoneOutlined className="icons" />
                <p className="custom-text2">Programări telefonice:</p>
                <p className="custom-text2">0758345402</p>
              </div>
              <br />
              <div>
                <MailOutlined className="icons" />
                <p className="custom-text2">Programări prin E-mail:</p>
                <p className="custom-text2">programari@dermahealthexpert.ro</p>
              </div>
              <br />
              <div>
                <CalendarOutlined className="icons" />
                <p className="custom-text2">Program clinică:</p>
                <p className="custom-text2">Luni - Duminică 08:00-21:00</p>
              </div>
              <br />
              <p className="custom-text2">Rețele de socializare:</p>
              <div>
                <a href="https://www.facebook.com/">
                  <FacebookOutlined className="icons" />
                </a>
                <a href="https://www.instagram.com/">
                  <InstagramOutlined className="icons" />
                </a>
              </div>
            </div>
            <div className="map-container">
              <LoadScript googleMapsApiKey={"AIzaSyDP6MsUCnjETs0gpMgzaIY8oQViSpKz63M"}>
                <GoogleMap
                  onLoad={onMapLoad}
                  center={{ lat: location.latitude, lng: location.longitude }}
                  // zoom={5}
                  options={{ minZoom: 10, maxZoom: 15 }}
                  mapContainerStyle={containerStyle}
                >
                  <Marker position={{ lat: location.latitude, lng: location.longitude }} />
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default Location;
