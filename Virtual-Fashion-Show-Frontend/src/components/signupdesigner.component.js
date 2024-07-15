import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './sqpage.css';

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileno, setMobileno] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, email, password, mobileno, location, photo);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("mobileno", mobileno);
    formData.append("location", location);
    formData.append("photo", photo);

    fetch("http://localhost:5000/registerdesigner", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data, "userRegister");
        alert("Sign Up Successful!");
        navigate("/sign-in");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Sign Up</h3>

      <div className="mb-3">
        <label>Full Name</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Name"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Email address</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Mobile No.</label>
        <input
          type="number"
          className="form-control"
          placeholder="Enter Mobile No."
          onChange={(e) => setMobileno(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Location</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Location"
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Photo</label>
        <input
          type="file"
          className="form-control"
          onChange={handleFileChange}
        />
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-secondary">
          Sign Up
        </button>
      </div>
      <p className="forgot-password text-right">
        Already registered <a href="/sign-in">sign in?</a>
      </p>
    </form>
  );
};

export default SignUp;
