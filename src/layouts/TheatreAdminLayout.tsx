import { Outlet, Link, useLocation } from 'react-router-dom';
import './TheatreAdminLayout.css';

function TheatreAdminLayout() {
    const location = useLocation();

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>🏢 Theatre Admin</h2>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/theatre-admin" className={isActive('/theatre-admin') && location.pathname === '/theatre-admin' ? 'nav-item active' : 'nav-item'}>
                        📊 Dashboard
                    </Link>
                    <Link to="/theatre-admin/theatres" className={isActive('/theatre-admin/theatres') ? 'nav-item active' : 'nav-item'}>
                        🏢 Theatres
                    </Link>
                    <Link to="/theatre-admin/screens" className={isActive('/theatre-admin/screens') ? 'nav-item active' : 'nav-item'}>
                        🎭 Screens
                    </Link>
                    <Link to="/theatre-admin/shows" className={isActive('/theatre-admin/shows') ? 'nav-item active' : 'nav-item'}>
                        🎥 Shows
                    </Link>
                    <Link to="/theatre-admin/analytics" className={isActive('/theatre-admin/analytics') ? 'nav-item active' : 'nav-item'}>
                        📈 Analytics
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <Link to="/" className="back-link">← Back to User Portal</Link>
                    <Link to="/test" className="back-link">🧪 Test Suite</Link>
                </div>
            </aside>

            <div className="admin-content">
                <header className="admin-header">
                    <div className="header-title">
                        <h1>Theatre Administration</h1>
                    </div>
                    <div className="header-actions">
                        <button className="btn-logout">Logout</button>
                    </div>
                </header>

                <main className="admin-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default TheatreAdminLayout;
