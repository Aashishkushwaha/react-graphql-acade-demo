import React from "react";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Snipper";
import AuthContext from "../context/auth-context";
import "./Events.css";

class Events extends React.Component {
  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null,
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  isActive = true;

  async componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents = async () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            price
            date
            creator {
              _id
              email
            }
          }
        }
      `,
    };

    try {
      let res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status !== 200) throw new Error("Failed!");

      let resData = await res.json();

      if (this.isActive)
        this.setState({
          events: resData.data.events,
          isLoading: false,
        });
    } catch (error) {
      console.log(error);
      if (this.isActive) this.setState({ isLoading: false });
    }
  };

  showDetailsHandler = (eventId) => {
    this.setState((prevState) => {
      const selectedEvent = prevState.events.find((e) => e._id === eventId);
      return {
        selectedEvent,
      };
    });
  };

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = async (e) => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const date = this.dateElRef.current.value;
    const price = +this.priceElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    )
      return;

    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {
            title: "${title}"
            description: "${description}"
            price: ${price}
            date: "${date}"
          }) {
            _id
            title
            description
            date
            price
          }
        }
      `,
    };

    const token = this.context.token;

    try {
      let res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200 && res.status !== 201) throw new Error("Failed!");

      let resData = await res.json();

      this.setState((prevState) => {
        const updatedEvents = [
          ...prevState.events,
          {
            _id: resData.data.createEvent._id,
            title: resData.data.createEvent.title,
            description: resData.data.createEvent.description,
            price: resData.data.createEvent.price,
            date: resData.data.createEvent.date,
            creator: {
              _id: this.context.userId,
            },
          },
        ];

        return {
          events: updatedEvents,
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  modalCancleHandler = (e) => {
    this.setState({ creating: false, selectedEvent: null });
  };

  bookEventHandler = async () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    }
    try {
      const requestBody = {
        query: `
          mutation {
            bookEvent(eventId: "${this.state.selectedEvent._id}") {
              _id
              createdAt
              updatedAt
            }
          }
        `,
      };

      const token = this.context.token;

      let res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200 && res.status !== 201) throw new Error("Failed!");

      await res.json();

      this.setState({ selectedEvent: null });
    } catch (error) {
      console.log(error);
      this.setState({ selectedEvent: null });
    }
  };

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    return (
      <>
        {this.state.creating || (this.state.selectedEvent && <Backdrop />)}
        {this.state.creating && (
          <Modal
            title="Add Event!"
            confirmText="Confirm"
            canConfirm
            canCancel
            onCancel={this.modalCancleHandler}
            onConfirm={this.modalConfirmHandler}
          >
            <form style={{ paddingRight: "1rem" }}>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input placeholder="Title" id="title" ref={this.titleElRef} />
              </div>

              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input placeholder="Price" id="price" ref={this.priceElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={this.dateElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  placeholder="Description"
                  ref={this.descriptionElRef}
                  id="description"
                  rows="4"
                />
              </div>
            </form>
          </Modal>
        )}

        {this.state.selectedEvent && (
          <Modal
            title={this.state.selectedEvent.title}
            canConfirm
            canCancel
            onCancel={this.modalCancleHandler}
            onConfirm={this.bookEventHandler}
            confirmText={this.context.token ? "Book" : "Confirm"}
          >
            <h1>{this.state.selectedEvent.title}</h1>
            <h2>
              ${this.state.selectedEvent.price} -{" "}
              {this.state.selectedEvent.date}
            </h2>
            <p>{this.state.selectedEvent.description}</p>
          </Modal>
        )}
        {this.context.token && (
          <div className="Event-control">
            <p>Share your own Events!</p>
            <button className="btn" onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <EventList
            authUserId={this.context.userId}
            events={this.state.events}
            onViewDetail={this.showDetailsHandler}
          />
        )}
      </>
    );
  }
}

export default Events;
