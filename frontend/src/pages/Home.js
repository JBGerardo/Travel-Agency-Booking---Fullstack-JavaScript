import React from "react";
import "../styles/Home.css"; 

function Home() {
  return (
    <div className="home-container">
      
      <img
        src="/Home-Logo.png" 
        alt="Home Logo"
        className="home-logo"
      />

      {/* Welcome message */}
      <div className="home-welcome">
        <h1>Welcome to our Travel Booking System</h1>
        <p>Explore destinations and book your next trip!</p>
      </div>
    </div>
  );
}

export default Home;
