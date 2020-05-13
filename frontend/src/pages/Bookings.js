import React from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Snipper";
import BookingList from "../components/Bookings/BookingList/BookingList";

class Bookings extends React.Component {
  state = {
    isLoading: false,
    bookings: [],
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fethcBookings();
  }

  fethcBookings = async () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
            }
          }
        }
      `,
    };

    try {
      const token = this.context.token;

      let res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) throw new Error("Failed!");

      let resData = await res.json();

      this.setState({
        bookings: resData.data.bookings,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
      this.setState({ isLoading: false });
    }
  };

  deleteBookingHandler = async (bookingId) => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        mutation {
          cancelBooking(bookingId: "${bookingId}") {
            _id
            title
          }
        }
      `,
    };

    try {
      const token = this.context.token;

      let res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) throw new Error("Failed!");

      await res.json();

      this.setState((prevState) => ({
        bookings: prevState.bookings.filter(
          (booking) => booking._id !== bookingId
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.log(error);
      this.setState({
        isLoading: false,
      });
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading && <Spinner />}
        <BookingList
          bookings={this.state.bookings}
          onDelete={this.deleteBookingHandler}
        />
      </React.Fragment>
    );
  }
}

export default Bookings;
