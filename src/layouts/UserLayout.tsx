import { Outlet, Link } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import LocationModal from '../components/common/LocationModal';
import './UserLayout.css';

function UserLayout() {
    const { location, isLocationModalOpen, setModalOpen } = useUserStore();

    const handleLocationClick = () => {
        setModalOpen(true);
    };

    return (
        <div className="user-layout">
            <LocationModal
                isOpen={isLocationModalOpen}
                onClose={() => setModalOpen(false)}
            />

            <header className="user-header">
                <div className="container header-content">
                    <Link to="/" className="logo">
                        <h1>🎬 BookMyShow</h1>
                    </Link>

                    <div className="search-bar-header">
                        <input type="text" placeholder="Search for Movies, Events, Plays, Sports and Activities" />
                        <button>🔍</button>
                    </div>

                    <div className="header-actions">
                        <div className="location-selector" onClick={handleLocationClick}>
                            <span>{location ? location.locationName : 'Select Location'}</span>
                            <span className="arrow-down">▼</span>
                        </div>
                        <button className="btn-sign-in">Sign In</button>
                    </div>
                </div>
            </header>

            <nav className="secondary-nav">
                <div className="container">
                    <Link to="/movies" className="nav-item">Movies</Link>
                    <Link to="/stream" className="nav-item">Stream</Link>
                    <Link to="/events" className="nav-item">Events</Link>
                    <Link to="/plays" className="nav-item">Plays</Link>
                    <Link to="/sports" className="nav-item">Sports</Link>
                    <Link to="/activities" className="nav-item">Activities</Link>
                    <Link to="/buzz" className="nav-item right">ListYourShow</Link>
                    <Link to="/corporates" className="nav-item right">Corporates</Link>
                    <Link to="/offers" className="nav-item right">Offers</Link>
                    <Link to="/giftcards" className="nav-item right">Gift Cards</Link>
                </div>
            </nav>

            <main className="user-main">
                <Outlet />
            </main>

            <footer className="user-footer">
                <div className="container">
                    <p>&copy; 2026 BookMyShow. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default UserLayout;
