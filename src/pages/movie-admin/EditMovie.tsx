import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_MOVIE } from '../../graphql/mutations';
import { GET_MOVIE } from '../../graphql/queries';
import { useNavigate, useParams } from 'react-router-dom';
import '../movie-admin/AddMovie.css';

function EditMovie() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { loading: loadingMovie, data: movieData } = useQuery(GET_MOVIE, {
        variables: { id },
        skip: !id,
    });

    const [updateMovie, { loading, error }] = useMutation(UPDATE_MOVIE);

    const [formData, setFormData] = useState({
        movieId: '',
        title: '',
        genres: '',
        duuid: '',
        releaseDate: '',
        cert: 'U',
        langs: '',
        castUUID: '',
        crewUUID: '',
        duration: '',
        description: '',
    });

    useEffect(() => {
        if (movieData?.movie) {
            const movie = movieData.movie;
            setFormData({
                movieId: movie.movieId || '',
                title: movie.title || '',
                genres: movie.genres?.join(', ') || '',
                duuid: movie.duuid || '',
                releaseDate: movie.releaseDate || '',
                cert: movie.cert || 'U',
                langs: movie.langs?.join(', ') || '',
                castUUID: movie.castUUID?.join(', ') || '',
                crewUUID: movie.crewUUID?.join(', ') || '',
                duration: movie.duration || '',
                description: movie.description || '',
            });
        }
    }, [movieData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateMovie({
                variables: {
                    movie: {
                        movieId: formData.movieId,
                        title: formData.title,
                        genres: formData.genres.split(',').map((g) => g.trim()),
                        duuid: formData.duuid,
                        releaseDate: formData.releaseDate,
                        cert: formData.cert,
                        langs: formData.langs.split(',').map((l) => l.trim()),
                        castUUID: formData.castUUID.split(',').map((c) => c.trim()),
                        crewUUID: formData.crewUUID.split(',').map((c) => c.trim()),
                        duration: formData.duration,
                        description: formData.description,
                    },
                },
            });

            alert('Movie updated successfully!');
            navigate('/movie-admin/movies');
        } catch (err) {
            console.error('Error updating movie:', err);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    if (loadingMovie) {
        return (
            <div className="add-movie-page">
                <div className="loading">Loading movie data...</div>
            </div>
        );
    }

    return (
        <div className="add-movie-page">
            <div className="page-header">
                <h2>Edit Movie</h2>
                <button onClick={() => navigate('/movie-admin/movies')} className="btn-back">
                    ← Back to Movies
                </button>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit} className="movie-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Movie ID *</label>
                            <input
                                type="text"
                                name="movieId"
                                value={formData.movieId}
                                onChange={handleChange}
                                placeholder="e.g., MV001_MOVIE"
                                required
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label>Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Pushpa 2: The Rule"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Genres * (comma-separated)</label>
                            <input
                                type="text"
                                name="genres"
                                value={formData.genres}
                                onChange={handleChange}
                                placeholder="e.g., Action, Drama, Thriller"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Duration UUID</label>
                            <input
                                type="text"
                                name="duuid"
                                value={formData.duuid}
                                onChange={handleChange}
                                placeholder="Duration identifier"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Release Date *</label>
                            <input
                                type="date"
                                name="releaseDate"
                                value={formData.releaseDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Certificate *</label>
                            <select name="cert" value={formData.cert} onChange={handleChange} required>
                                <option value="U">U (Universal)</option>
                                <option value="UA">UA (Parental Guidance)</option>
                                <option value="A">A (Adults Only)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Languages * (comma-separated)</label>
                            <input
                                type="text"
                                name="langs"
                                value={formData.langs}
                                onChange={handleChange}
                                placeholder="e.g., Hindi, Telugu, Tamil"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Duration *</label>
                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="e.g., 180 min or 3h"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Cast UUIDs (comma-separated)</label>
                        <input
                            type="text"
                            name="castUUID"
                            value={formData.castUUID}
                            onChange={handleChange}
                            placeholder="Cast member identifiers"
                            required
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>Crew UUIDs (comma-separated)</label>
                        <input
                            type="text"
                            name="crewUUID"
                            value={formData.crewUUID}
                            onChange={handleChange}
                            placeholder="Crew member identifiers"
                            required
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Movie description..."
                            required
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            Error: {error.message}
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" onClick={() => navigate('/movie-admin/movies')} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Movie'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditMovie;
