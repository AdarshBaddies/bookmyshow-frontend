import { Outlet, Link, useLocation } from 'react-router-dom';
import './MovieAdminLayout.css';

function MovieAdminLayout() {
    const location = useLocation();

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <div className="movie-admin-layout">
            <aside className="movie-admin-sidebar">
                <div className="sidebar-header">
                    <h2>🎥 Movie Admin</h2>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/movie-admin" className={isActive('/movie-admin') && location.pathname === '/movie-admin' ? 'nav-item active' : 'nav-item'}>
                        📊 Dashboard
                    </Link>
                    <Link to="/movie-admin/movies" className={isActive('/movie-admin/movies') ? 'nav-item active' : 'nav-item'}>
                        🎬 Movies
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <Link to="/" className="back-link">← Back to User Portal</Link>
                    <Link to="/test" className="back-link">🧪 Test Suite</Link>
                </div>
            </aside>

            <div className="movie-admin-content">
                <header className="movie-admin-header">
                    <div className="header-title">
                        <h1>Movie Administration</h1>
                    </div>
                    <div className="header-actions">
                        <button className="btn-logout">Logout</button>
                    </div>
                </header>

                <main className="movie-admin-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MovieAdminLayout;
