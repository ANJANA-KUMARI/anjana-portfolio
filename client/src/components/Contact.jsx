import { useState } from 'react';
import SectionHeader from './SectionHeader.jsx';
import { sendContactMessage } from '../services/api.js';

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
  company: '',
};

export default function Contact({ profile }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: 'loading', message: 'Sending your message…' });

    try {
      const response = await sendContactMessage(form);
      setStatus({ type: 'success', message: response.message });
      setForm(initialForm);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  }

  return (
    <section className="section" id="contact">
      <div className="container">
        <SectionHeader
          eyebrow="Contact"
          title="Let’s build something useful"
          description="I am interested in remote backend software engineering opportunities and meaningful product work."
        />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} className="contact-grid">
          <div className="contact-panel reveal">
            <p className="contact-kicker">Start a conversation</p>
            <h3>Have a backend engineering role or project in mind?</h3>
            <p>
              Send a message with the problem you are solving, the technology stack, and the expected collaboration model.
            </p>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <div className="contact-meta">
              <div>
                <span>Location</span>
                <strong>{profile.location}</strong>
              </div>
              <div>
                <span>Work preference</span>
                <strong>Remote / International teams</strong>
              </div>
            </div>
          </div>

          {/* <form className="contact-form reveal" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <label>
                Name
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  minLength="2"
                  maxLength="80"
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  maxLength="160"
                  required
                />
              </label>
            </div>
            <label>
              Subject
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                maxLength="120"
                required
              />
            </label>
            <label>
              Message
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                minLength="10"
                maxLength="2000"
                rows="6"
                required
              />
            </label>

            <label className="honeypot" aria-hidden="true">
              Company
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                tabIndex="-1"
                autoComplete="off"
              />
            </label>

            <button className="button primary submit-button" type="submit" disabled={status.type === 'loading'}>
              {status.type === 'loading' ? 'Sending…' : 'Send message'}
            </button>

            {status.message ? (
              <p className={`form-status ${status.type}`} role="status">
                {status.message}
              </p>
            ) : null}
          </form> */}
        </div>
      </div>
    </section>
  );
}
