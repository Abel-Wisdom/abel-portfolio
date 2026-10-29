
import { useRef } from "react";
import {
  Quote,
  MessageSquareQuote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const testimonials = [
  {
    name: "Add Reviewer Name",
    role: "Add Job Title",
    company: "Add Company or Organization",
    photo: "",
    quote:
      "Replace this placeholder with genuine feedback about your technical skills, collaboration, and problem-solving.",
  },
  {
    name: "Add Reviewer Name",
    role: "Add Job Title",
    company: "Add Company or Organization",
    photo: "",
    quote:
      "Add a genuine recommendation describing a project you worked on and the value you brought to the team.",
  },
  {
    name: "Add Reviewer Name",
    role: "Add Job Title",
    company: "Add Company or Organization",
    photo: "",
    quote:
      "Use this card to highlight your communication, reliability, and ability to learn new technologies.",
  },
  {
    name: "Add Reviewer Name",
    role: "Add Job Title",
    company: "Add Company or Organization",
    photo: "",
    quote:
      "Add another review that describes your approach to debugging, finding solutions, and delivering quality work.",
  },
  {
    name: "Add Reviewer Name",
    role: "Add Job Title",
    company: "Add Company or Organization",
    photo: "",
    quote:
      "Use this space for genuine feedback about your teamwork, initiative, and commitment to improving your skills.",
  },
  {
    name: "Add Reviewer Name",
    role: "Add Job Title",
    company: "Add Company or Organization",
    photo: "",
    quote:
      "Add a real recommendation from a mentor, colleague, client, or collaborator who has agreed to be featured.",
  },
];

function Testimonials() {
  const carouselRef = useRef(null);

  function scrollTestimonials(direction) {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const card = carousel.querySelector(".testimonial-card");

    if (!card) return;

    const gap = 20;

    carousel.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: "smooth",
    });
  }

  return (
    <section
      className="section testimonials-section"
      id="testimonials"
    >
      <div className="container">
        <div className="testimonials-heading">
          <div>
            <p className="section-label">KIND WORDS</p>

            <h2 className="section-title">
              What people say <span>about working with me.</span>
            </h2>

            <p className="section-description">
              Genuine feedback from people who have experienced my work,
              collaboration, and approach to solving problems.
            </p>
          </div>

          <div className="testimonials-heading-icon">
            <MessageSquareQuote size={25} />
          </div>
        </div>

        
<div className="testimonials-carousel-layout">
  <button
    className="testimonial-arrow testimonial-arrow-side testimonial-arrow-left"
    type="button"
    aria-label="Scroll testimonials left"
    onClick={() => scrollTestimonials(-1)}
  >
    <ChevronLeft size={22} />
  </button>

  <div
    className="testimonials-carousel"
    ref={carouselRef}
    tabIndex={0}
    aria-label="Testimonials carousel"
  >
    {testimonials.map((testimonial, index) => (
      <article
        className="testimonial-card card"
        key={`${testimonial.name}-${index}`}
      >
        <div className="testimonial-top">
          <div className="testimonial-quote-icon">
            <Quote size={21} />
          </div>
          <span className="testimonial-number">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <p className="testimonial-quote">
          “{testimonial.quote}”
        </p>

        <div className="testimonial-reviewer">
          {testimonial.photo ? (
            <img
              className="testimonial-avatar"
              src={testimonial.photo}
              alt={testimonial.name}
              loading="lazy"
            />
          ) : (
            <div
              className="testimonial-avatar testimonial-avatar-placeholder"
              aria-hidden="true"
            >
              ?
            </div>
          )}

          <div className="testimonial-reviewer-details">
            <h3>{testimonial.name}</h3>
            <p>{testimonial.role}</p>
            <span>{testimonial.company}</span>
          </div>
        </div>
      </article>
    ))}
  </div>

  <button
    className="testimonial-arrow testimonial-arrow-side testimonial-arrow-right"
    type="button"
    aria-label="Scroll testimonials right"
    onClick={() => scrollTestimonials(1)}
  >
    <ChevronRight size={22} />
  </button>
</div>


        <p className="testimonials-note">
          These cards are placeholders until genuine testimonials are added.
        </p>
      </div>
    </section>
  );
}

export default Testimonials;
