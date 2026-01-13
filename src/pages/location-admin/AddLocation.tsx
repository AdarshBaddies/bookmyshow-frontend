import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_LOCATION } from '../../graphql/mutations';
import { useNavigate } from 'react-router-dom';
import './AddLocation.css';


function AddLocation() {
    const navigate = useNavigate();
    const [addLocation, { loading }] = useMutation(ADD_LOCATION);

    // State for list of locations to add
    const [locations, setLocations] = useState([
        { id: '', name: '', lat: '', lon: '' }
    ]);

    const handleAddRow = () => {
        setLocations([...locations, { id: '', name: '', lat: '', lon: '' }]);
    };

    const handleRemoveRow = (index: number) => {
        if (locations.length === 1) return;
        setLocations(locations.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, field: string, value: string) => {
        const newLocs = [...locations];
        (newLocs[index] as any)[field] = value;
        setLocations(newLocs);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Transform to correct types (float for lat/lon)
        const formattedLocations = locations.map(l => {
            const lat = parseFloat(l.lat);
            const lon = parseFloat(l.lon);

            if (isNaN(lat) || isNaN(lon)) {
                throw new Error(`Invalid coordinates for location: ${l.name}`);
            }

            return {
                id: l.id.trim(),
                name: l.name.trim(),
                lat: lat,
                lon: lon
            };
        });

        console.log("Sending Location Payload:", JSON.stringify(formattedLocations, null, 2));

        try {
            const { data } = await addLocation({
                variables: { loc: formattedLocations }
            });

            if (data.addLocation) {
                alert('Locations added successfully!');
                // Reset or redirect
                setLocations([{ id: '', name: '', lat: '', lon: '' }]);
            }
        } catch (err: any) {
            alert('Error adding locations: ' + err.message);
        }
    };

    return (
        <div className="add-location-page">
            <div className="page-header">
                <h2>Location Admin: Add Cities</h2>
                <button className="btn-secondary" onClick={() => navigate('/')}>Back to Home</button>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="locations-grid-header">
                        <span>Location ID</span>
                        <span>City Name</span>
                        <span>Latitude</span>
                        <span>Longitude</span>
                        <span>Action</span>
                    </div>

                    {locations.map((loc, idx) => (
                        <div key={idx} className="location-row">
                            <input
                                type="text"
                                placeholder="e.g. L001"
                                value={loc.id}
                                onChange={e => handleChange(idx, 'id', e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="e.g. Mumbai"
                                value={loc.name}
                                onChange={e => handleChange(idx, 'name', e.target.value)}
                                required
                            />
                            <input
                                type="number"
                                step="any"
                                placeholder="Lat (e.g. 19.07)"
                                value={loc.lat}
                                onChange={e => handleChange(idx, 'lat', e.target.value)}
                                required
                            />
                            <input
                                type="number"
                                step="any"
                                placeholder="Lon (e.g. 72.87)"
                                value={loc.lon}
                                onChange={e => handleChange(idx, 'lon', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveRow(idx)}
                                className="btn-remove-row"
                                disabled={locations.length === 1}
                            >
                                ✖
                            </button>
                        </div>
                    ))}

                    <div className="form-actions">
                        <button type="button" onClick={handleAddRow} className="btn-add-row">
                            + Add Another City
                        </button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Locations'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddLocation;
