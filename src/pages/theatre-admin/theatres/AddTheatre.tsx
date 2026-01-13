import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_THEATRE } from '../../../graphql/mutations';
import { useNavigate } from 'react-router-dom';
import './AddTheatre.css';

function AddTheatre() {
    const navigate = useNavigate();
    const [addTheatre, { loading, error }] = useMutation(ADD_THEATRE);

    const [formData, setFormData] = useState({
        name: '',
        locId: '',
        locationName: '',
        pan: '',
        link: '',
        lat: '',
        lon: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Lat/Lon need to be floats
            const variables = {
                theatre: {
                    name: formData.name,
                    locId: formData.locId,
                    locationName: formData.locationName,
                    pan: formData.pan,
                    link: formData.link,
                    location: {
                        lat: parseFloat(formData.lat),
                        lon: parseFloat(formData.lon),
                    },
                },
            };

            const { data } = await addTheatre({ variables });

            if (data && data.addTheatre) {
                alert(`Theatre "${data.addTheatre.name}" added successfully!\nID: ${data.addTheatre.id}`);
                navigate('/theatre-admin/theatres');
            }
        } catch (err) {
            console.error("Error adding theatre:", err);
        }
    };

    return (
        <div className="add-theatre-page">
            <div className="page-header">
                <h2>Add New Theatre</h2>
                <button onClick={() => navigate('/theatre-admin/theatres')} className="btn-back">
                    ← Back
                </button>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit} className="theatre-form">
                    <div className="form-group">
                        <label>Theatre Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. PVR Koramangala"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Location ID *</label>
                            <input
                                type="text"
                                name="locId"
                                value={formData.locId}
                                onChange={handleChange}
                                placeholder="e.g., BLR1"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Location Name (City/Area) *</label>
                            <input
                                type="text"
                                name="locationName"
                                value={formData.locationName}
                                onChange={handleChange}
                                placeholder="e.g., Bangalore"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Latitude *</label>
                            <input
                                type="number"
                                step="any"
                                name="lat"
                                value={formData.lat}
                                onChange={handleChange}
                                placeholder="12.9716"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Longitude *</label>
                            <input
                                type="number"
                                step="any"
                                name="lon"
                                value={formData.lon}
                                onChange={handleChange}
                                placeholder="77.5946"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>PAN Number *</label>
                        <input
                            type="text"
                            name="pan"
                            value={formData.pan}
                            onChange={handleChange}
                            placeholder="ABCDE1234F"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Website/Map Link *</label>
                        <input
                            type="url"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            placeholder="https://..."
                            required
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            Error: {error.message}
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Create Theatre'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTheatre;
