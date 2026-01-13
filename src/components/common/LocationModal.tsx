import React, { useState } from 'react';
import './LocationModal.css';
import { useUserStore } from '../../store/userStore';

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const POPULAR_CITIES = [
    { name: 'Mumbai', lat: 19.0760, lon: 72.8777, icon: '🏙️' },
    { name: 'Delhi-NCR', lat: 28.7041, lon: 77.1025, icon: '🏛️' },
    { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, icon: '💻' },
    { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, icon: '🥘' },
    { name: 'Chennai', lat: 13.0827, lon: 80.2707, icon: '🌊' },
    { name: 'Kolkata', lat: 22.5726, lon: 88.3639, icon: '🌉' },
    { name: 'Pune', lat: 18.5204, lon: 73.8567, icon: '🎓' },
    { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714, icon: '🪁' },
];

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
    const { setLocation } = useUserStore();
    const [detecting, setDetecting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        setDetecting(true);
        setError('');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    locationName: 'My Location',
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
                setDetecting(false);
                onClose();
            },
            (err) => {
                console.error(err);
                setError('Unable to retrieve your location. Please select a city manually.');
                setDetecting(false);
            }
        );
    };

    const handleSelectCity = (city: typeof POPULAR_CITIES[0]) => {
        setLocation({
            locationName: city.name,
            lat: city.lat,
            lon: city.lon
        });
        onClose();
    };

    return (
        <div className="location-modal-overlay">
            <div className="location-modal">
                <div className="modal-header">
                    <h2>Select Location</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="search-location">
                    <input type="text" placeholder="Search for your city" />
                    <button>🔍</button>
                </div>

                <div className="detect-section">
                    <button className="detect-btn" onClick={handleDetectLocation} disabled={detecting}>
                        {detecting ? 'Detecting...' : '📍 Detect my location'}
                    </button>
                    {error && <p className="error-msg">{error}</p>}
                </div>

                <div className="popular-cities">
                    <h3>Popular Cities</h3>
                    <div className="city-grid">
                        {POPULAR_CITIES.map((city) => (
                            <div
                                key={city.name}
                                className="city-item"
                                onClick={() => handleSelectCity(city)}
                            >
                                <span className="city-icon">{city.icon}</span>
                                <span className="city-name">{city.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Radius Slider Section */}
                <div className="radius-section" style={{ marginTop: '25px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    <h3 style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px' }}>Search Range: {useUserStore.getState().location?.radius || 40} km</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#999' }}>5 km</span>
                        <input
                            type="range"
                            min="5"
                            max="100"
                            step="5"
                            defaultValue={useUserStore.getState().location?.radius || 40}
                            onChange={(e) => {
                                const newRad = parseInt(e.target.value);
                                const currentLoc = useUserStore.getState().location;
                                // Only update if location exists, otherwise just wait for city selection
                                if (currentLoc) {
                                    setLocation({ ...currentLoc, radius: newRad });
                                }
                            }}
                            style={{ flex: 1, accentColor: '#f84464', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '0.8rem', color: '#999' }}>100 km</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '5px' }}>
                        Adjust this if you can't find theatres near you.
                    </p>
                </div>

                <div className="other-cities-link">
                    <a href="#">View All Cities</a>
                </div>
            </div>
        </div>
    );
};

export default LocationModal;
