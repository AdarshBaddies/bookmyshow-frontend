import { gql } from '@apollo/client';

// =============================
// Theatre Queries
// =============================

export const FETCH_THEATRE = gql`
  query FetchTheatre($id: String!) {
    fetchTheatre(id: $id) {
      id
      name
      locId
      locationName
      pan
      link
      location {
        lon
        lat
      }
      createdAt
      updatedAt
    }
  }
`;

// =============================
// Screen Queries
// =============================

export const GET_SCREENS = gql`
  query GetScreens($theatreId: ID!) {
    getScreens(theatreId: $theatreId) {
      id
      name
      layoutId
      theatreId
    }
  }
`;

export const GET_SCREEN = gql`
  query GetScreen($layoutId: String!) {
    getScreen(layoutId: $layoutId) {
      id
      name
      theatreId
      layoutId
      seatIDs
      categories {
        catId
        name
        rows
        columns
        seats {
          type
          seatId
        }
      }
      createdAt
      updatedAt
    }
  }
`;

// =============================
// Show Queries
// =============================

export const GET_SHOW_DATES = gql`
  query GetShowDates($locID: String!, $movieID: String!) {
    getShowDates(locID: $locID, movieID: $movieID)
  }
`;

export const GET_SHOWS = gql`
  query GetShows($user: QueryWithLocation, $d: String!) {
    getShows(user: $user, d: $d) {
      Date
      TID
      TN
      locId
      LC {
        lon
        lat
      }
      LN
      LK
      Dist
      SHS {
        showId
        screenId
        layoutId
        status
        publishTime
        showTime
        categoryDetails {
          categoryId
          rowCount
          columnsCount
          categoryName
          price
          currency
        }
      }
    }
  }
`;

export const GET_SHOWS_FOR_ADMIN = gql`
  query GetShowsForAdmin($theatreId: String!) {
    getShowsForAdmin(theatreId: $theatreId) {
      theatreId
      movieId
      showId
      showTime
      screenId
      status
    }
  }
`;

export const GET_SHOW_DETAILS = gql`
  query GetShowDetails($theatreId: String!, $showId: Int!, $showTime: DateTime!) {
    getShowDetails(theatreId: $theatreId, showId: $showId, showTime: $showTime) {
      showId
      movieId
      screenId
      status
      showTime
      categoryDetails {
        categoryName
        price
        currency
      }
      bookingDetails {
        booking_id
        user_id
        total_price
      }
    }
  }
`;

// =============================
// Booking Queries
// =============================

export const GET_SEATS = gql`
  query GetSeats($id: String!) {
    getSeats(id: $id) {
      id
      Status
    }
  }
`;

export const GET_AVAILABLE_SEATS = gql`
  query GetAvailableSeats($show_id: Int!) {
    getAvailableSeats(show_id: $show_id) {
      seatID
      Status
    }
  }
`;

export const GET_BOOKING_DETAILS = gql`
  query GetBookingDetails($bookId: String!) {
    getBookingDetails(bookId: $bookId) {
      booking_id
      show_id
      user_id
      total_price
      payment_status
      booking_status
      created_at
      updated_at
      seatIDs
    }
  }
`;

export const GET_BOOKINGS_FOR_SHOW = gql`
  query GetBookingsDetails($show_id: Int!) {
    getBookingsDetails(show_id: $show_id) {
      booking_id
      user_id
      total_price
      payment_status
      booking_status
      seatIDs
    }
  }
`;

// =============================
// Movie Queries
// =============================

export const GET_MOVIE = gql`
  query GetMovie($id: String!) {
    movie(id: $id) {
      movieId
      title
      genres
      duuid
      releaseDate
      cert
      langs
      castUUID
      crewUUID
      duration
      description
    }
  }
`;

export const GET_MOVIES = gql`
  query GetMovies($user: QueryWithLocation!) {
    getMovies(user: $user) {
      movieId
      title
      genres
    }
  }
`;
