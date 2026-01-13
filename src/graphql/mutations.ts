import { gql } from '@apollo/client';

// =============================
// Theatre Mutations
// =============================

export const ADD_THEATRE = gql`
  mutation AddTheatre($theatre: TheatreRegistrationInput!) {
    addTheatre(theatre: $theatre) {
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
// Screen Mutations
// =============================

export const ADD_SCREEN = gql`
  mutation AddScreen($screen: ScreenInput!) {
    addScreen(screen: $screen) {
      id
      name
      theatreId
      seatIDs
      layoutId
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
    }
  }
`;

// =============================
// Show Mutations
// =============================

export const ADD_SHOW = gql`
  mutation AddShow($date: DateTime!, $movieID: String!, $theatreId: String!, $shs: [InputShowDetails!]!) {
    addShow(date: $date, movieID: $movieID, theatreId: $theatreId, shs: $shs) {
      showId
      screenId
      showTime
      publishTime
      status
      theatreId
      movieId
      layoutId
      categoryDetails {
        categoryId
        categoryName
        price
        currency
      }
    }
  }
`;

export const UPDATE_SHOW_STATUS = gql`
  mutation UpdateShowStatus($theatreId: String!, $showId: Int!, $status: Int!) {
    updateShowStatus(theatreId: $theatreId, showId: $showId, status: $status) {
      showId
      status
      theatreId
    }
  }
`;

// =============================
// Booking Mutations
// =============================

export const LOCK_SEATS = gql`
  mutation LockSeats($lock: SeatLockInput!) {
    lockSeats(lock: $lock) {
      success
      BID
      showID
      userID
      expiresAt
      message
      total_price
    }
  }
`;

export const RELEASE_SEATS = gql`
  mutation ReleaseSeats($rel: SeatReleaseInput!) {
    releaseSeats(rel: $rel) {
      rply
      msg
    }
  }
`;

export const MAKE_PAYMENT = gql`
  mutation MakePayment($input: MakePaymentInput!) {
    makePayment(input: $input) {
      bookingID
      paymentURL
      clientSecret
      message
    }
  }
`;

// =============================
// Movie Mutations
// =============================

export const CREATE_MOVIE = gql`
  mutation CreateMovie($movie: AddMovieInput!) {
    createMovie(movie: $movie) {
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

export const UPDATE_MOVIE = gql`
  mutation UpdateMovie($movie: AddMovieInput!) {
    updateMovie(movie: $movie) {
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

export const DELETE_MOVIE = gql`
  mutation DeleteMovie($id: String!) {
    deleteMovie(id: $id)
  }
`;

// =============================
// Location Mutations
// =============================

export const ADD_LOCATION = gql`
  mutation AddLocation($loc: [AddLocationInput!]!) {
    addLocation(loc: $loc)
  }
`;

