import { Link } from 'react-router-dom';
import './MovieAdminDashboard.css';

function MovieAdminDashboard() {
    return (
        <div className="movie-dashboard">
            <h2>Movie Administration Dashboard</h2>
            <p className="dashboard-subtitle">Manage movies across the platform (Highest Role)</p>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">🎬</div>
                    <div className="stat-details">
                        <h3>Total Movies</h3>
                        <p className="stat-number">-</p>
                        <span className="stat-label">Across all theatres</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-details">
                        <h3>Active Movies</h3>
                        <p className="stat-number">-</p>
                        <span className="stat-label">Currently showing</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🎭</div>
                    <div className="stat-details">
                        <h3>Genres</h3>
                        <p className="stat-number">-</p>
                        <span className="stat-label">Different categories</span>
                    </div>
                </div>
            </div>

            <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                    <Link to="/movie-admin/movies" className="action-card">
                        <div className="action-icon">📋</div>
                        <h4>View All Movies</h4>
                        <p>Browse and manage all movies in the database</p>
                    </Link>

                    <Link to="/movie-admin/movies/add" className="action-card highlight">
                        <div className="action-icon">➕</div>
                        <h4>Add New Movie</h4>
                        <p>Add a new movie to the platform</p>
                    </Link>

                    <Link to="/test" className="action-card">
                        <div className="action-icon">🧪</div>
                        <h4>Test GraphQL</h4>
                        <p>Test movie-related queries and mutations</p>
                    </Link>
                </div>
            </div>

            <div className="info-section">
                <h3>About Movie Admin</h3>
                <p>
                    As a Movie Admin (highest role), you have platform-wide access to manage all movies.
                    Movies you add here will be available for all theatres to create shows.
                </p>
                <ul>
                    <li>✅ Add new movies with complete details</li>
                    <li>✅ Edit existing movie information</li>
                    <li>✅ Delete outdated movies</li>
                    <li>✅ Manage genres, cast, and crew</li>
                </ul>
            </div>
        </div>
    );
}

export default MovieAdminDashboard;
