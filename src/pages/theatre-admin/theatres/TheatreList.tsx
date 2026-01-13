import { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { FETCH_THEATRE } from '../../../graphql/queries';
import { Link } from 'react-router-dom';
import './TheatreList.css';

function TheatreList() {
    const [searchId, setSearchId] = useState('');
    const [searchedTheatre, setSearchedTheatre] = useState<any>(null);

    const [getTheatre, { loading, error }] = useLazyQuery(FETCH_THEATRE, {
        onCompleted: (data) => {
            setSearchedTheatre(data.fetchTheatre);
        },
        onError: () => {
            setSearchedTheatre(null);
        },
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchId.trim()) {
            getTheatre({
                variables: { id: searchId.trim() },
            });
        }
    };

    return (
        <div className="theatre-list-page">
            <div className="page-header">
                <h2>Manage Theatres</h2>
                <Link to="/theatre-admin/theatres/add" className="btn-primary">
                    + Add Theatre
                </Link>
            </div>

            <div className="search-section">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-group">
                        <input
                            type="text"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            placeholder="Enter Theatre ID (e.g., PVRAH)"
                            className="search-input"
                        />
                        <button type="submit" className="btn-search" disabled={loading}>
                            {loading ? '🔍 Searching...' : '🔍 Search'}
                        </button>
                    </div>
                </form>
                <p className="search-hint">💡 Use Theatre ID to find specific theatres</p>
            </div>

            {error && (
                <div className="error-message">
                    <strong>Theatre not found!</strong>
                    <p>No theatre exists with ID: <code>{searchId}</code></p>
                </div>
            )}

            {searchedTheatre && (
                <div className="theatre-card-detailed">
                    <div className="card-header">
                        <h3>{searchedTheatre.name}</h3>
                        <span className="theatre-id-badge">{searchedTheatre.id}</span>
                    </div>

                    <div className="card-body">
                        <div className="detail-row">
                            <span className="label">Location Name:</span>
                            <span className="value">{searchedTheatre.locationName}</span>
                        </div>

                        <div className="detail-row">
                            <span className="label">Location ID:</span>
                            <span className="value">{searchedTheatre.locId}</span>
                        </div>

                        <div className="detail-row">
                            <span className="label">Coordinates:</span>
                            <span className="value">
                                {searchedTheatre.location.lat}, {searchedTheatre.location.lon}
                            </span>
                        </div>

                        <div className="detail-row">
                            <span className="label">Link:</span>
                            <a href={searchedTheatre.link} target="_blank" rel="noopener noreferrer" className="value-link">
                                View Website ↗
                            </a>
                        </div>

                        <div className="detail-row full-width">
                            <span className="label">Pan No:</span>
                            <span className="value">{searchedTheatre.pan}</span>
                        </div>
                    </div>
                </div>
            )}

            {!searchedTheatre && !loading && !error && (
                <div className="empty-state">
                    <div className="empty-icon">🏢</div>
                    <h3>Search for a Theatre</h3>
                    <p>Enter the Theatre ID above to manage details</p>
                </div>
            )}
        </div>
    );
}

export default TheatreList;
