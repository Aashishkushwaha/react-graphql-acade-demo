import React from "react";
import AuthContext from "../context/auth-context";
import "./Auth.css";

class AuthPage extends React.Component {
  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
    this.state = {
      isLogin: true,
    };
  }

  static contextType = AuthContext;

  switchModeHandler = (e) => {
    this.setState((state) => ({
      isLogin: !state.isLogin,
    }));
  };

  submitHandler = async (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `,
    };

    if (!this.state.isLogin)
      requestBody = {
        query: `
        mutation {
          createUser(userInput: {email: "${email}", password: "${password}"}) {
            _id
            email
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
      if (res.status !== 200 && res.status !== 201) throw new Error("Failed!");
      let resData = await res.json();
      if (resData.data.login.token) {
        this.context.login(
          resData.data.login.token,
          resData.data.login.userId,
          resData.data.login.tokenExpiration
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input ref={this.emailEl} id="email" placeholder="valid email" />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            ref={this.passwordEl}
            type="password"
            id="password"
            placeholder="password"
          />
        </div>
        <div className="form-actions">
          <button type="sumbit">Submit</button>
          <button type="button" onClick={this.switchModeHandler}>
            Swith to {this.state.isLogin ? "Signup" : "Login"}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
