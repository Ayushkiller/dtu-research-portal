import React, { useState, useEffect } from 'react';
import './LandingPage.css';
function LandingPage({ onFinish }) {
  const [quote, setQuote] = useState('');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Array of inspirational quotes
    const quotes = [
      "The best way to predict the future is to invent it.",
      "Research is to see what everybody else has seen, and to think what nobody else has thought.",
      "An investment in knowledge pays the best interest.",
      // Add more quotes as desired
    ];
//f
    // Select a random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);

    // Set timers for fading effects
    const timer1 = setTimeout(() => setFadeOut(true), 1000); // Start fading out after 4 seconds
    const timer2 = setTimeout(() => onFinish(), 2000);       // Finish the landing page after 5 seconds

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  return (
    <div className={`landing-page ${fadeOut ? 'fade-out' : ''}`}>
      <h1 className="university-name">Delhi Technological University</h1>
      <h2 className="portal-name">Research Portal</h2>
      <p className="quote">{quote}</p>
    </div>
  );
}

export default LandingPage;