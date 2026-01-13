import { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_SCREENS, GET_SCREEN } from '../../../graphql/queries';
import { Link } from 'react-router-dom';
import './ScreenList.css';

function ScreenList() {
    const [searchTheatreId, setSearchTheatreId] = useState('');
    const [screens, setScreens] = useState<any[]>([]);
    const [searched, setSearched] = useState(false);
    const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
    const [selectedScreenData, setSelectedScreenData] = useState<any>(null);

    const [getScreens, { loading: loadingList, error: listError }] = useLazyQuery(GET_SCREENS, {
        onCompleted: (data) => {
            setScreens(data.getScreens || []);
            setSearched(true);
            // Reset details when new search happens
            setSelectedScreenData(null);
            setSelectedLayoutId(null);
        },
        onError: () => {
            setScreens([]);
            setSearched(true);
        }
    });

    const [getScreenDetails, { loading: loadingDetails, error: detailsError }] = useLazyQuery(GET_SCREEN, {
        onCompleted: (data) => {
            if (data?.getScreen) {
                setSelectedScreenData(data.getScreen);
            }
        }
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTheatreId.trim()) {
            getScreens({
                variables: { theatreId: searchTheatreId.trim() }
            });
        }
    };

    const handleViewDetails = (layoutId: string) => {
        if (!layoutId) {
            alert("This screen has no Layout ID");
            return;
        }
        setSelectedLayoutId(layoutId);
        getScreenDetails({
            variables: { layoutId: layoutId }
        });
    };

    const closeDetails = () => {
        setSelectedLayoutId(null);
        setSelectedScreenData(null);
    }

    return (
        <div className="screen-list-page">
            <div className="page-header">
                <h2>Manage Screens</h2>
                <Link to="/theatre-admin/screens/add" className="btn-primary">
                    + Add New Screen
                </Link>
            </div>

            <div className="search-section">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-group">
                        <input
                            type="text"
                            value={searchTheatreId}
                            onChange={(e) => setSearchTheatreId(e.target.value)}
                            placeholder="Enter Theatre ID (e.g., PVRAH)"
                            className="search-input"
                        />
                        <button type="submit" className="btn-search" disabled={loadingList}>
                            {loadingList ? 'Searching...' : '🔍 Find Screens'}
                        </button>
                    </div>
                </form>
            </div>

            {listError && (
                <div className="error-message">
                    <strong>Error:</strong> {listError.message}
                </div>
            )}

            {searched && screens.length === 0 && !listError && (
                <div className="empty-state">
                    <div className="empty-icon">🎭</div>
                    <h3>No Screens Found</h3>
                    <p>No screens found for Theatre ID: <strong>{searchTheatreId}</strong></p>
                </div>
            )}

            {/* Screen List Grid */}
            {screens.length > 0 && (
                <div className="screens-grid">
                    {screens.map((screen) => (
                        <div
                            key={screen.id}
                            className={`screen-card ${selectedLayoutId === screen.layoutId ? 'active' : ''}`}
                            onClick={() => handleViewDetails(screen.layoutId)}
                        >
                            <div className="screen-icon">🎬</div>
                            <div className="screen-info">
                                <h3>{screen.name}</h3>
                                <div className="screen-meta">
                                    <span><strong>ID:</strong> {screen.id}</span>
                                    <span><strong>Layout:</strong> {screen.layoutId || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="screen-action-hint">
                                {selectedLayoutId === screen.layoutId ? 'Viewing 👉' : 'Click to View'}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Details Modal / Panel */}
            {selectedLayoutId && (
                <div className="screen-details-panel">
                    {loadingDetails && <div className="loading-spinner">Loading Layout Details...</div>}

                    {detailsError && (
                        <div className="error-message">
                            Failed to load details: {detailsError.message}
                        </div>
                    )}

                    {selectedScreenData && (
                        <div className="details-content">
                            <div className="details-header">
                                <h3>Layout Details: {selectedScreenData.name}</h3>
                                <button onClick={closeDetails} className="btn-close">✖</button>
                            </div>

                            <div className="layout-stats">
                                <div className="stat-pill">
                                    <span className="label">Total Categories:</span>
                                    <span className="val">{selectedScreenData.categories?.length || 0}</span>
                                </div>
                                <div className="stat-pill">
                                    <span className="label">Total Seats:</span>
                                    <span className="val">{selectedScreenData.seatIDs?.length || 0}</span>
                                </div>
                            </div>

                            <div className="categories-preview">
                                <h4>Category Structure</h4>
                                <table className="cats-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Grid Size</th>
                                            <th>Total Seats</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedScreenData.categories?.map((cat: any) => (
                                            <tr key={cat.catId}>
                                                <td>{cat.name}</td>
                                                <td>{cat.rows} x {cat.columns}</td>
                                                <td>{cat.seats.filter((s: any) => s.type !== 0).length}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Visual Mini-Map could go here in future */}
                        </div>
                    )}
                </div>
            )}

            {!searched && (
                <div className="empty-state-large">
                    <div className="empty-icon">✨</div>
                    <h3>Manage Your Screens</h3>
                    <p>Search by Theatre ID to view existing screens, or create a new one.</p>
                </div>
            )}
        </div>
    );
}

export default ScreenList;
