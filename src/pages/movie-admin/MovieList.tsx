import { useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_MOVIE } from '../../graphql/queries';
import { DELETE_MOVIE } from '../../graphql/mutations';
import { Link } from 'react-router-dom';
import './MovieList.css';

function MovieList() {
    const [searchId, setSearchId] = useState('');
    const [searchedMovie, setSearchedMovie] = useState<any>(null);

    const [getMovie, { loading, error }] = useLazyQuery(GET_MOVIE, {
        onCompleted: (data) => {
            setSearchedMovie(data.movie);
        },
        onError: () => {
            setSearchedMovie(null);
        },
    });

    const [deleteMovie] = useMutation(DELETE_MOVIE);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchId.trim()) {
            getMovie({
                variables: { id: searchId.trim() },
            });
        }
    };

    const handleDelete = async (movieId: string, title: string) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            try {
                await deleteMovie({
                    variables: { id: movieId },
                });
                alert('Movie deleted successfully!');
                setSearchedMovie(null);
                setSearchId('');
            } catch (err: any) {
                alert('Error deleting movie: ' + err.message);
            }
        }
    };

    return (
        <div className="movie-search-page">
            <div className="page-header">
                <h2>Manage Movies</h2>
                <Link to="/movie-admin/movies/add" className="btn-primary">
                    + Add Movie
                </Link>
            </div>

            <div className="search-section">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-group">
                        <input
                            type="text"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            placeholder="Enter Movie ID (e.g., MV001_MOVIE)"
                            className="search-input"
                        />
                        <button type="submit" className="btn-search" disabled={loading}>
                            {loading ? '🔍 Searching...' : '🔍 Search'}
                        </button>
                    </div>
                </form>

                <p className="search-hint">
                    💡 Enter the exact Movie ID to view details
                </p>
            </div>

            {error && (
                <div className="error-message">
                    <strong>Movie not found!</strong>
                    <p>No movie exists with ID: <code>{searchId}</code></p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        Make sure the Movie ID is correct and the movie exists in the database.
                    </p>
                </div>
            )}

            {searchedMovie && (
                <div className="movie-details-card">
                    <div className="card-header">
                        <h3>Movie Details</h3>
                        <div className="action-buttons">
                            <Link
                                to={`/movie-admin/movies/edit/${searchedMovie.movieId}`}
                                className="btn-edit"
                            >
                                ✏️ Edit
                            </Link>
                            <button
                                className="btn-delete"
                                onClick={() => handleDelete(searchedMovie.movieId, searchedMovie.title)}
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    </div>

                    <div className="movie-details-grid">
                        <div className="detail-item">
                            <label>Movie ID</label>
                            <div className="detail-value"><code>{searchedMovie.movieId}</code></div>
                        </div>

                        <div className="detail-item">
                            <label>Title</label>
                            <div className="detail-value">{searchedMovie.title}</div>
                        </div>

                        <div className="detail-item">
                            <label>Genres</label>
                            <div className="detail-value">
                                {searchedMovie.genres.map((genre: string, idx: number) => (
                                    <span key={idx} className="genre-badge">{genre}</span>
                                ))}
                            </div>
                        </div>

                        <div className="detail-item">
                            <label>Certificate</label>
                            <div className="detail-value">
                                <span className="cert-badge">{searchedMovie.cert}</span>
                            </div>
                        </div>

                        <div className="detail-item">
                            <label>Release Date</label>
                            <div className="detail-value">{searchedMovie.releaseDate}</div>
                        </div>

                        <div className="detail-item">
                            <label>Duration</label>
                            <div className="detail-value">{searchedMovie.duration}</div>
                        </div>

                        <div className="detail-item full-width">
                            <label>Languages</label>
                            <div className="detail-value">
                                {searchedMovie.langs.join(', ')}
                            </div>
                        </div>

                        <div className="detail-item full-width">
                            <label>Description</label>
                            <div className="detail-value">{searchedMovie.description}</div>
                        </div>

                        <div className="detail-item full-width">
                            <label>Cast UUIDs</label>
                            <div className="detail-value">
                                <code>{searchedMovie.castUUID.join(', ')}</code>
                            </div>
                        </div>

                        <div className="detail-item full-width">
                            <label>Crew UUIDs</label>
                            <div className="detail-value">
                                <code>{searchedMovie.crewUUID.join(', ')}</code>
                            </div>
                        </div>

                        <div className="detail-item">
                            <label>Duration UUID</label>
                            <div className="detail-value"><code>{searchedMovie.duuid}</code></div>
                        </div>
                    </div>
                </div>
            )}

            {!loading && !error && !searchedMovie && (
                <div className="empty-state">
                    <div className="empty-icon">🎬</div>
                    <h3>Search for a Movie</h3>
                    <p>Enter a Movie ID in the search bar above to view its details</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '1rem' }}>
                        Or add a new movie to get started
                    </p>
                </div>
            )}
        </div>
    );
}

export default MovieList;
