import React, { Component } from 'react';
import './sqpage.css';

export default class Login extends Component {
  constructor(props){
    super(props);
    this.state={
      email:"",
      password:"",
    };
    this.handleSubmit=this.handleSubmit.bind(this);
  }
  handleSubmit(e)
  {
    e.preventDefault();
    const{email,password}=this.state;
    console.log(email,password);
    fetch("http://localhost:5000/login-user",{
      method:"POST",
      crossDomain:true,
      headers:{
        "Content-Type":"application/json",
        Accept:"application/json",
        "Access-Control-Allow-Origin":"*",
      },
      body:JSON.stringify({
        email,
        password,
      }),
    })
    .then((res)=>res.json())
    .then((data)=>{
      console.log(data,"userRegister");
      if(data.status==="ok"){
        alert("Login Successful!!!");
        window.localStorage.setItem("token", data.data);
        window.localStorage.setItem("loggedIn", true);
        window.localStorage.setItem("userType", data.userType); // Save userType in localStorage
        window.localStorage.setItem("email", email); // Save userType in localStorage
        // Redirect based on userType
        if (data.userType === "designer") {
            window.location.href = "./designerdash";
        } else {
            window.location.href = "./userdash";
        }
      }
    })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Sign In</h3>

        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            onChange={(e)=>this.setState({email: e.target.value})}
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            onChange={(e)=>this.setState({password: e.target.value})}
          />
        </div>

        {/* <div className="mb-3">
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id="customCheck1"
              onChange={this.handleCheckboxChange}
            />
            <label className="custom-control-label" htmlFor="customCheck1">
              Login as Designer
            </label>
          </div>
        </div> */}

        <div className="d-grid">
          <button type="submit" className="btn btn-secondary">
            Submit
          </button>
        </div>
        <p className="forgot-password text-left">
          Don't have account?<a href="/sign-up"> Sigh-up as user</a> or <br></br>
          <a href="/sign-up-designer"> Sigh-up as Designer</a>
        </p>
      </form>
    )
  }
}
