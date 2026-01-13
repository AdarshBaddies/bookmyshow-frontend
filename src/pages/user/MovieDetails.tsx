import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_MOVIE } from '../../graphql/queries';
import './MovieDetails.css';

function MovieDetails() {
    const { movieId } = useParams();
    const navigate = useNavigate();

    const { loading, error, data } = useQuery(GET_MOVIE, {
        variables: { id: movieId || '' },
        skip: !movieId
    });

    if (loading) return <div className="loading-state">Loading Movie Details...</div>;
    if (error) return <div className="error-state">Error: {error.message}</div>;

    const movie = data?.movie;

    if (!movie) return <div className="error-state">Movie not found</div>;

    // Generate colors/images based on ID/Title for consistent "random" look
    const bgGradient = stringToGradient(movie.title);
    const posterColor = stringToColor(movie.title);

    return (
        <div className="movie-details-page">
            {/* Hero / Banner Section */}
            <div className="movie-hero" style={{ background: bgGradient }}>
                <div className="hero-overlay"></div>

                <div className="container hero-content-layout">
                    {/* Vertical Poster area */}
                    <div className="poster-container">
                        <div className="poster-image" style={{ backgroundColor: posterColor }}>
                            <span className="poster-text">{movie.title[0]}</span>
                        </div>
                        <div className="status-badge">In Cinemas</div>
                    </div>

                    {/* Movie Info */}
                    <div className="movie-info-block">
                        <h1 className="movie-title">{movie.title}</h1>

                        <div className="rating-block">
                            <span className="heart-icon">❤️</span>
                            <span className="percent">85%</span>
                            <span className="votes">25.3K ratings</span>
                        </div>

                        <div className="tags-block">
                            <span className="info-tag">2D, 3D, IMAX 2D</span>
                            <span className="info-tag">{movie.langs.join(', ')}</span>
                        </div>

                        <div className="meta-block">
                            <span>{movie.duration} • {movie.genres.join(', ')} • {movie.cert} • {new Date(movie.releaseDate).toLocaleDateString()}</span>
                        </div>

                        <button className="btn-book-tickets" onClick={() => navigate(`/book/${movie.movieId}`)}>
                            Book Tickets
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container content-section">
                <div className="main-col">
                    <section className="about-section">
                        <h2>About the Movie</h2>
                        <p>{movie.description}</p>
                    </section>

                    <section className="cast-section">
                        <h2>Cast</h2>
                        <div className="cast-grid">
                            {movie.castUUID && movie.castUUID.length > 0 ? (
                                movie.castUUID.map((id: string, index: number) => (
                                    <div key={index} className="cast-card">
                                        <div className="cast-img-placeholder" style={{ backgroundColor: stringToColor(id) }}></div>
                                        <p className="cast-name">{id}</p> {/* Displaying ID as requested */}
                                        <p className="cast-role">Actor</p>
                                    </div>
                                ))
                            ) : (
                                <p>No cast information available.</p>
                            )}
                        </div>
                    </section>

                    <section className="crew-section">
                        <h2>Crew</h2>
                        <div className="cast-grid">
                            {movie.crewUUID && movie.crewUUID.length > 0 ? (
                                movie.crewUUID.map((id: string, index: number) => (
                                    <div key={index} className="cast-card">
                                        <div className="cast-img-placeholder" style={{ backgroundColor: stringToColor(id) }}></div>
                                        <p className="cast-name">{id}</p> {/* Displaying ID as requested */}
                                        <p className="cast-role">Crew</p>
                                    </div>
                                ))
                            ) : (
                                <p>No crew information available.</p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

// Helpers for visual placeholders
function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + "00000".substring(0, 6 - c.length) + c;
}

function stringToGradient(str: string) {
    const c1 = stringToColor(str);
    const c2 = stringToColor(str.split('').reverse().join(''));
    return `linear-gradient(to right, ${c1}, ${c2})`;
}

export default MovieDetails;
