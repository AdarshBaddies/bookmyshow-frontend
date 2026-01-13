function TheatreAdminDashboard() {
    return (
        <div className="dashboard">
            <h2>Theatre Dashboard</h2>
            <p>Welcome to Theatre Administration Portal</p>

            <div className="quick-links" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
                <a href="/theatre-admin/theatres" style={{ padding: '2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', textDecoration: 'none', color: 'var(--color-text-primary)' }}>
                    <h3>🏢 Manage Theatres</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Add and manage your theatres</p>
                </a>
                <a href="/theatre-admin/screens" style={{ padding: '2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', textDecoration: 'none', color: 'var(--color-text-primary)' }}>
                    <h3>🎭 Manage Screens</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Create screen layouts</p>
                </a>
                <a href="/theatre-admin/shows" style={{ padding: '2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', textDecoration: 'none', color: 'var(--color-text-primary)' }}>
                    <h3>🎥 Manage Shows</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Schedule and manage shows</p>
                </a>
            </div>
        </div>
    );
}

export default TheatreAdminDashboard;
