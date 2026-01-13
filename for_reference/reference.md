

___________________-____________________theatre________________________________________________________

mutation {
  addTheatre(
    theatre: {
      name: "PVR Andheri"
      location: {
        lon: 72.8424
        lat: 19.1197
      }
      locId: "MUM1"
      locationName: "Andheri, Mumbai"
      pan: "AAACP1234A"
      link: "https://www.pvrcinemas.com/theatre/andheri-mumbai"
    }
  ) {
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


{ "data": { "addTheatre": { "id": "PVRAH", "name": "PVR Andheri", "locId": "MUM1", "locationName": "Andheri, Mumbai", "pan": "AAACP1234A", "link": "https://www.pvrcinemas.com/theatre/andheri-mumbai", "location": { "lon": 72.8424, "lat": 19.1197 }, "createdAt": "", "updatedAt": "" } } }


query {
  fetchTheatre(
   id:"PVRAH"
  ) {
    id
    name
    locId
    createdAt
    updatedAt
    link
    location{
      lon
    }
    locationName
  }
}

{
  "data": {
    "fetchTheatre": {
      "id": "PVRAH",
      "name": "PVR Andheri",
      "locId": "MUM1",
      "createdAt": "seconds:1763758424 nanos:770824000",
      "updatedAt": "seconds:1763758424 nanos:770824000",
      "link": "https://www.pvrcinemas.com/theatre/andheri-mumbai",
      "location": {
        "lon": 72.8424
      },
      "locationName": "Andheri, Mumbai"
    }
  }
}


_______________________________________screen_____________________________________________________________


mutation {
  addScreen(
    screen: {
      name: "Screen 6 (100 Seater)"
      theatreId: "PVRAH"
      categories: [
        {
          catId: 1
          name: "Diamond (Row A)"
          rows: 1
          columns: 18
          seats: [
            { type: 0, seatId: "-" }
            { type: 0, seatId: "-" }
            { type: 0, seatId: "-" }
            { type: 3, seatId: "A1" }
            { type: 3, seatId: "A2" }
            { type: 3, seatId: "A3" }
            { type: 3, seatId: "A4" }
            { type: 3, seatId: "A5" }
            { type: 3, seatId: "A6" }
            { type: 0, seatId: "-" }
            { type: 0, seatId: "-" }
            { type: 3, seatId: "A7" }
            { type: 3, seatId: "A8" }
            { type: 3, seatId: "A9" }
            { type: 3, seatId: "A10" }
            { type: 3, seatId: "A11" }
            { type: 3, seatId: "A12" }
            { type: 3, seatId: "A13" }
          ]
        }
        {
          catId: 2
          name: "Premium (Rows B-C)"
          rows: 2
          columns: 20
          seats: [
            { type: 0, seatId: "-" }
            { type: 2, seatId: "B1" }
            { type: 2, seatId: "B2" }
            { type: 2, seatId: "B3" }
            { type: 2, seatId: "B4" }
            { type: 2, seatId: "B5" }
            { type: 2, seatId: "B6" }
            { type: 2, seatId: "B7" }
            { type: 2, seatId: "B8" }
            { type: 2, seatId: "B9" }
            { type: 0, seatId: "-" }
            { type: 0, seatId: "-" }
            { type: 2, seatId: "B10" }
            { type: 2, seatId: "B11" }
            { type: 2, seatId: "B12" }
            { type: 2, seatId: "B13" }
            { type: 2, seatId: "B14" }
            { type: 2, seatId: "B15" }
            { type: 2, seatId: "B16" }
            { type: 2, seatId: "B17" }

            { type: 0, seatId: "-" }
            { type: 2, seatId: "C1" }
            { type: 2, seatId: "C2" }
            { type: 2, seatId: "C3" }
            { type: 2, seatId: "C4" }
            { type: 2, seatId: "C5" }
            { type: 2, seatId: "C6" }
            { type: 2, seatId: "C7" }
            { type: 2, seatId: "C8" }
            { type: 2, seatId: "C9" }
            { type: 0, seatId: "-" }
            { type: 0, seatId: "-" }
            { type: 2, seatId: "C10" }
            { type: 2, seatId: "C11" }
            { type: 2, seatId: "C12" }
            { type: 2, seatId: "C13" }
            { type: 2, seatId: "C14" }
            { type: 2, seatId: "C15" }
            { type: 2, seatId: "C16" }
            { type: 2, seatId: "C17" }
          ]
        }
        {
          catId: 3
          name: "Standard (Rows D-E)"
          rows: 2
          columns: 24
          seats: [
            { type: 1, seatId: "D1" }
            { type: 1, seatId: "D2" }
            { type: 1, seatId: "D3" }
            { type: 1, seatId: "D4" }
            { type: 1, seatId: "D5" }
            { type: 1, seatId: "D6" }
            { type: 1, seatId: "D7" }
            { type: 1, seatId: "D8" }
            { type: 1, seatId: "D9" }
            { type: 1, seatId: "D10" }
            { type: 1, seatId: "D11" }
            { type: 1, seatId: "D12" }
            { type: 0, seatId: "-" }
            { type: 0, seatId: "-" }
            { type: 1, seatId: "D13" }
            { type: 1, seatId: "D14" }
            { type: 1, seatId: "D15" }
            { type: 1, seatId: "D16" }
            { type: 1, seatId: "D17" }
            { type: 1, seatId: "D18" }
            { type: 1, seatId: "D19" }
            { type: 1, seatId: "D20" }
            { type: 1, seatId: "D21" }
            { type: 1, seatId: "D22" }

            { type: 1, seatId: "E1" }
            { type: 1, seatId: "E2" }
            { type: 1, seatId: "E3" }
            { type: 1, seatId: "E4" }
            { type: 1, seatId: "E5" }
            { type: 1, seatId: "E6" }
            { type: 1, seatId: "E7" }
            { type: 1, seatId: "E8" }
            { type: 1, seatId: "E9" }
            { type: 1, seatId: "E10" }
            { type: 1, seatId: "E11" }
            { type: 1, seatId: "E12" }
            { type: 0, seatId: "-" }
            { type: 0, seatId: "-" }
            { type: 1, seatId: "E13" }
            { type: 1, seatId: "E14" }
            { type: 1, seatId: "E15" }
            { type: 1, seatId: "E16" }
            { type: 1, seatId: "E17" }
            { type: 1, seatId: "E18" }
            { type: 1, seatId: "E19" }
            { type: 1, seatId: "E20" }
            { type: 1, seatId: "E21" }
            { type: 1, seatId: "E22" }
          ]
        }
      ]
      seatIDs: [
        "A1","A2","A3","A4","A5","A6","A7","A8","A9","A10","A11","A12","A13",
        "B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","B14","B15","B16","B17",
        "C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","C11","C12","C13","C14","C15","C16","C17",
        "D1","D2","D3","D4","D5","D6","D7","D8","D9","D10","D11","D12","D13","D14","D15","D16","D17","D18","D19","D20","D21","D22",
        "E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12","E13","E14","E15","E16","E17","E18","E19","E20","E21","E22"
      ]
    }
  ) {
    id
    name
    theatreId
    seatIDs
    layoutId
  }
}


{
  "data": {
    "addScreen": {
      "id": "35nxabhz88hGvRnUzESF9jjIlvb",
      "name": "Screen 6 (100 Seater)",
      "theatreId": "PVRAH",
      "seatIDs": [],
      "layoutId": "100007"
    }
  }
}


query {
  getScreen(
    layoutId: "100007"
  ){
    name
    layoutId
    theatreId
    seatIDs
    createdAt
    updatedAt
    categories{
      catId
      name
      rows
      columns
      seats{
        type
        seatId
      }
    }
  }
}

query {
  getScreens(
    theatreId: "PVRAH"
  ){
    name
    layoutId
  }
}


________________________ _____________________show__________________________________________________

mutation {
  addShow(
    date: "2025-11-22T00:00:00Z"
    movieID: "MV001_MOVIE"
    theatreId: "PVRAH"
    shs: [
      {
        screenId: "35nxabhz88hGvRnUzESF9jjIlvb"
        status: 1
        publishTime: "2025-11-22T01:00:00Z"
        showTime: "2025-11-22T02:00:00Z"
        lang: "Hindi"
        layoutId: "100007"
        categoryDetails: [
          { categoryId: 3, rowCount: 1, columnsCount: 20, categoryName: "Diamond", price: 400.00, currency: "INR" },
          { categoryId: 2, rowCount: 1, columnsCount: 22, categoryName: "Premium", price: 300.00, currency: "INR" },
          { categoryId: 1, rowCount: 1, columnsCount: 24, categoryName: "Standard", price: 200.00, currency: "INR" }
        ]
      },
      {
        screenId: "35nxabhz88hGvRnUzESF9jjIlvb"
        status: 1
        publishTime: "2025-11-22T03:00:00Z"
        showTime: "2025-11-22T04:00:00Z"
        lang: "Hindi"
        layoutId: "100007"
        categoryDetails: [
          { categoryId: 3, rowCount: 1, columnsCount: 20, categoryName: "Diamond", price: 380.00, currency: "INR" },
          { categoryId: 2, rowCount: 1, columnsCount: 22, categoryName: "Premium", price: 290.00, currency: "INR" },
          { categoryId: 1, rowCount: 1, columnsCount: 24, categoryName: "Standard", price: 190.00, currency: "INR" }
        ]
      }
    ]
  ) {
    showId
    screenId
    showTime
    publishTime
    status
    theatreId
  }
}

{
  "data": {
    "addShow": [
      {
        "showId": 10014,
        "screenId": "35nxabhz88hGvRnUzESF9jjIlvb",
        "showTime": "seconds:1763776800",
        "publishTime": "seconds:1763773200",
        "status": 0,
        "theatreId": "PVRAH"
      },
      {
        "showId": 10015,
        "screenId": "35nxabhz88hGvRnUzESF9jjIlvb",
        "showTime": "seconds:1763784000",
        "publishTime": "seconds:1763780400",
        "status": 0,
        "theatreId": "PVRAH"
      }
    ]
  }
}


query {
  getShowDates(locID: "MUM1", movieID: "MV001_MOVIE")
}


query  {
  getShows(
    user: {
      lon: 72.8424
      lat: 19.1197
      radius: 10
      movieId: "MV001_MOVIE"
    }
    # Use the YYYYMMDD format to match your Redis keys
    d: "20251122" 
  ) {
    Date
    TID
    TN
    SHS{
      showId
      layoutId
      categoryDetails{
        price
      }
    }
  }
}


query GetShowsAtPVRAndheri {
  getShowsForAdmin(
    theatreId: "PVRAH"
  ) {
    theatreId
    movieId
    showId
    showTime
    
  }
}


query GetShowDetailsForAdmin {
  getShowDetails(
    theatreId: "PVRAH"
    showId: 10014
    showTime: "2025-11-22T09:00:00Z"
  ) {
    showId
    movieId
    screenId
    status
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


______________________________________booking_______________________________________________________


query GetAvailableSeatsForShow {
  getAvailableSeats(show_id: 10014) {
    seatID
    Status
  }
}


query GetSeatsStatus {
  getSeats(id: "10014") {
    id
    Status
  }
}


mutation LockSeatsForUser {
  lockSeats(
    lock: {
      showID: 10014 
      userID: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11" 
      categoryId: 2        
      seatIDs: ["B10", "B11", "C10", "C11"] 
    }
  ) {
    success
    BID # This is the booking ID you need for the next step
    total_price
    expiresAt
    message
  }
}


mutation ReleaseLockedSeats {
  releaseSeats(
    rel: {
      showID: 10014
      BID: "LOCK-a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11-20251123-01KAPHTWA7AC1Z1X1ZVHYRMAFH"
      userID: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
      seatIDs: ["B10", "B11", "C10", "C11"]
    }
  ) {
    rply
    msg
  }
}


mutation FinalizePayment {
  makePayment(
    input: {
      bookingID: "LOCK-a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11-20251123-01KAPJDM6BFF693QM1DJEGRCCW"
      paymentMethodId: "pm_card_visa" 
    }
  ) {
    bookingID
    paymentURL
    clientSecret
    message
  }
}


query GetAllBookingsForShow {
  getBookingsDetails(show_id: 10014) {
    booking_id
    user_id
    total_price
    payment_status
    booking_status
    seatIDs
    payment_status
    booking_status
  }
}

query GetBookingDetailsByID {
  getBookingDetails(bookId: "LOCK-a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11-20251123-01KAPJDM6BFF693QM1DJEGRCCW") {
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


