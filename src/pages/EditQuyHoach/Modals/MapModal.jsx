import { useState, useRef } from 'react';
import { Modal, Input, Button, List } from 'antd';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidHVhbmFuaDMxaiIsImEiOiJjbTMzMmo2d3AxZ2g0Mmlwejl1YzM0czRoIn0.vCpAJx2b_FVhC3LDfmdLTA';
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search?';
const params = {
    format: 'json',
    addressdetails: 1,
    polygon_geojson: 1,
    countrycodes: 'VN',
};

const MapModal = ({ isVisible, setIsMapModalVisible, setFormData, setSelectedDistrict, setSelectedProvince }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [marker, setMarker] = useState(null);
    const mapRef = useRef(null);
    const [searchResults, setSearchResults] = useState([]);
    const [viewport, setViewport] = useState({
        latitude: 21.0285,
        longitude: 105.8542,
        zoom: 12,
    });

    const handleMapClick = (event) => {
        const { lngLat } = event;
        console.log('Clicked location:', lngLat);
    };

    const handleAddLocation = async () => {
        if (marker) {
            try {
                const response = await axios.get(
                    `https://api.quyhoach.xyz/get_district_provinces/${marker.latitude}/${marker.longitude}`
                );

                console.log(response);


                // Cập nhật giá trị trong EditQuyHoach
                setFormData((prevData) => ({
                    ...prevData,
                    description: response.data.diachi, // Set tên quy hoạch
                }));

                setSelectedDistrict(response.data.district)
                setSelectedProvince(response.data.provinces)

                setIsMapModalVisible(false);
            } catch (error) {
                console.error('Error calling API:', error);
            }
        } else {
            console.log('No location selected!');
        }
    };

    const handleSearch = async () => {
        if (searchTerm) {
            try {
                const { data } = await axios.get(
                    `${NOMINATIM_BASE_URL}${new URLSearchParams({
                        ...params,
                        q: searchTerm, // Thêm searchTerm vào tham số tìm kiếm
                    }).toString()}`
                );

                if (data && data.length > 0) {
                    setSearchResults(data); // Cập nhật kết quả tìm kiếm
                } else {
                    setSearchResults([]); // Nếu không có kết quả, xóa danh sách
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        }
    };

    const handleSelectLocation = (location) => {
        const latitude = parseFloat(location.lat);
        const longitude = parseFloat(location.lon);

        // Cập nhật marker và di chuyển bản đồ đến vị trí được chọn
        setMarker({
            latitude,
            longitude,
        });

        if (mapRef.current) {
            mapRef.current.flyTo({
                center: [longitude, latitude],
                essential: true, // Bắt buộc di chuyển ngay lập tức
                zoom: 14, // Cập nhật zoom nếu cần
            });
        }

        setSearchResults([]); // Ẩn danh sách kết quả sau khi chọn
        setSearchTerm(''); // Xóa text trong ô tìm kiếm
    };

    return (
        <Modal
            title="Mapbox Modal"
            visible={isVisible}
            onCancel={() => setIsMapModalVisible(false)}
            footer={null}
            width={800}
        >
            <div style={{ height: '400px', position: 'relative' }}>
                {/* Thanh tìm kiếm */}
                <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, width: '80%' }}>
                    <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Nhập địa chỉ để tìm kiếm"
                        style={{ width: '80%' }}
                        onPressEnter={handleSearch} // Gửi yêu cầu tìm kiếm khi nhấn Enter
                    />
                    <Button onClick={handleSearch} style={{ marginTop: 10 }}>
                        Tìm kiếm
                    </Button>

                    {/* Nút "Thêm địa điểm" */}
                    <Button
                        onClick={handleAddLocation}
                        style={{ marginTop: 10, marginLeft: 10 }}
                        disabled={!marker} // Disable nút nếu chưa có marker
                    >
                        Thêm địa điểm
                    </Button>
                </div>

                {/* Danh sách kết quả tìm kiếm */}
                {searchResults.length > 0 && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 50,
                            left: 10,
                            zIndex: 1,
                            backgroundColor: 'white',
                            width: '80%',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <List
                            dataSource={searchResults}
                            renderItem={(item) => (
                                <List.Item
                                    onClick={() => handleSelectLocation(item)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {item.display_name}
                                </List.Item>
                            )}
                        />
                    </div>
                )}

                {/* Bản đồ */}
                <Map
                    ref={mapRef}
                    initialViewState={viewport}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    mapboxAccessToken={MAPBOX_TOKEN}
                    style={{ width: '100%', height: '100%' }}
                    onMove={(evt) => setViewport(evt.viewState)}
                    onClick={() => { handleMapClick }}
                >
                    {marker && <Marker latitude={marker.latitude} longitude={marker.longitude} color="red" />}
                </Map>
            </div>
        </Modal>
    );
};

export default MapModal;
