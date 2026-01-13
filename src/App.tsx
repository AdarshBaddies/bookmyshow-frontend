import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './graphql/client';

// Layouts
import UserLayout from './layouts/UserLayout';
import TheatreAdminLayout from './layouts/TheatreAdminLayout';
import MovieAdminLayout from './layouts/MovieAdminLayout';

// User Pages
import HomePage from './pages/user/HomePage';

// Theatre Admin Pages
import TheatreAdminDashboard from './pages/theatre-admin/TheatreAdminDashboard';
import TheatreList from './pages/theatre-admin/theatres/TheatreList';
import AddTheatre from './pages/theatre-admin/theatres/AddTheatre';
import ScreenList from './pages/theatre-admin/screens/ScreenList';
import AddScreen from './pages/theatre-admin/screens/AddScreen';
import ShowList from './pages/theatre-admin/shows/ShowList';
import AddShow from './pages/theatre-admin/shows/AddShow';
import AddLocation from './pages/location-admin/AddLocation';


// Movie Admin Pages
import MovieAdminDashboard from './pages/movie-admin/MovieAdminDashboard';
import MovieList from './pages/movie-admin/MovieList';
import AddMovie from './pages/movie-admin/AddMovie';
import EditMovie from './pages/movie-admin/EditMovie';

// Test Page
import TestEndpoint from './pages/TestEndpoint';

function App() {
    return (
        <ApolloProvider client={apolloClient}>
            <BrowserRouter>
                <Routes>
                    {/* User Portal */}
                    <Route path="/" element={<UserLayout />}>
                        <Route index element={<HomePage />} />
                        {/* More user routes will be added */}
                    </Route>

                    {/* Theatre Admin Portal */}
                    <Route path="/theatre-admin" element={<TheatreAdminLayout />}>
                        <Route index element={<TheatreAdminDashboard />} />
                        <Route path="theatres" element={<TheatreList />} />
                        <Route path="theatres/add" element={<AddTheatre />} />
                        <Route path="screens" element={<ScreenList />} />
                        <Route path="screens/add" element={<AddScreen />} />
                        <Route path="shows" element={<ShowList />} />
                        <Route path="shows/add" element={<AddShow />} />


                        {/* More theatre admin routes will be added */}
                    </Route>

                    {/* Location Admin Portal */}
                    <Route path="/location-admin" element={<AddLocation />} />

                    {/* Movie Admin Portal */}
                    <Route path="/movie-admin" element={<MovieAdminLayout />}>
                        <Route index element={<MovieAdminDashboard />} />
                        <Route path="movies" element={<MovieList />} />
                        <Route path="movies/add" element={<AddMovie />} />
                        <Route path="movies/edit/:id" element={<EditMovie />} /> {/* Added edit movie route */}
                    </Route>

                    {/* Test Suite (existing) */}
                    <Route path="/test" element={<TestEndpoint />} />
                </Routes>
            </BrowserRouter>
        </ApolloProvider>
    );
}

export default App;
