import React, { useState, useEffect } from 'react';
import './Carousel.css';

const testimonials = [
  {
    id: 1,
    text: "The staff were friendly and attentive, ensuring everything ran smoothly. I also loved the interactive elements that allowed attendees to connect and participate.",
    author: "John Doe",
    image: "https://images.pexels.com/photos/29681709/pexels-photo-29681709/free-photo-of-diverse-group-on-religious-pilgrimage-in-mountainous-area.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 2,
    text: "What an amazing experience! The venue was perfect and the organization was flawless. Would definitely recommend to anyone looking for a memorable event.",
    author: "Jane Smith",
    image: "https://images.pexels.com/photos/13911084/pexels-photo-13911084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 3,
    text: "I was impressed by the attention to detail. From the decorations to the schedule, everything was thoughtfully planned and executed beautifully.",
    author: "Alex Johnson",
    image: "https://images.pexels.com/photos/31432923/pexels-photo-31432923/free-photo-of-stargazing-under-the-milky-way-at-campsite.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  }
];

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Auto-advance slides
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => 
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isPaused]);
  
  const handlePrevious = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };
  
  const handleNext = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const goToSlide = (index) => {
    setActiveIndex(index);
  };
  
  return (
    <div 
      className="testimonial-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="testimonial-card">
        <div className="testimonial-image">
          <img src={testimonials[activeIndex].image} alt="Event" />
        </div>
        <div className="testimonial-content">
          <p className="testimonial-text">
            {testimonials[activeIndex].text}
          </p>
          <p className="testimonial-author">{testimonials[activeIndex].author}</p>
        </div>
        
        
        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <span 
              key={index} 
              className={`dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
