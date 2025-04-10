import React, { useState } from "react";
import "./Faq.css";
import faqImage from '../../assets/images/faq.png';
import Header from '../Header/Header'
const FAQ_DATA = [
  {
    question: "This is a FAQ Tile for FAQ Question?",
    answer:
      "The staff were friendly and attentive, ensuring everything ran smoothly. I also loved the interactive elements that allowed attendees to connect and participate.",
  },
  {
    question: "This is a FAQ Tile for FAQ Question?",
    answer: "Here's a placeholder answer for FAQ 2.",
  },
  {
    question: "This is a FAQ Tile for FAQ Question?",
    answer: "Here's a placeholder answer for FAQ 3.",
  },
  {
    question: "This is a FAQ Tile for FAQ Question?",
    answer: "Here's a placeholder answer for FAQ 4.",
  },
];

const FAQSection = () => {
  const [openStates, setOpenStates] = useState(Array(FAQ_DATA.length).fill(false));

  const toggleFAQ = (index) => {
    const newStates = [...openStates];
    newStates[index] = !newStates[index];
    setOpenStates(newStates);
  };

  return (
    <>
    <Header/>
    <div className="faq-section">
      <div className="faq-image-container">
        <img src={faqImage} alt="Event" className="faq-image" />
      </div>
      <div className="faq-grid">
        {FAQ_DATA.map((faq, index) => (
          <div
            className={`faq-tile ${openStates[index] ? "open" : "close"}`}
            key={index}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              <strong>{faq.question}</strong>
              <span className="faq-icon">{openStates[index] ? "−" : "+"}</span>
            </div>
            {openStates[index] && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div></>
  );
};

export default FAQSection;
