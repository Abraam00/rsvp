import { useEffect, useState } from 'react'
import { CalendarDays, Clock3, MapPin, Heart, Sparkles, CheckCircle2, ChevronDown } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

function Envelope({ onOpen, opened }) {
  return (
    <button className={`envelope-stage ${opened ? 'opened' : ''}`} onClick={onOpen} aria-label="Open your invitation" disabled={opened}>
      <span className="envelope-hint">A little something for you</span>
      <span className="envelope" aria-hidden="true">
        <span className="letter"><span>You're invited</span><Heart size={20} fill="currentColor" /></span>
        <span className="envelope-back" />
        <span className="envelope-front" />
        <span className="flap" />
        <span className="bow"><i /><i /><b /></span>
      </span>
      <span className="open-label">Tap to open <Sparkles size={15} /></span>
    </button>
  )
}

function App() {
  const [opened, setOpened] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', attendance: 'yes', guests: '1', dietary: '', message: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (opened) setTimeout(() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' }), 650)
  }, [opened])

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setStatus({ type: '', message: '' })
    try {
      const response = await fetch(`${API_BASE}/api/rsvps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, guests: Number(form.guests) })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'We could not submit your RSVP. Please try again.')
      setStatus({ type: 'success', message: 'Thank you! Your RSVP has been received. We can’t wait to celebrate with you.' })
      setForm({ name: '', email: '', attendance: 'yes', guests: '1', dietary: '', message: '' })
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Something went wrong. Please try again.' })
    } finally { setBusy(false) }
  }

  return (
    <main>
      <section className={`hero ${opened ? 'is-open' : ''}`}>
        <Envelope onOpen={() => setOpened(true)} opened={opened} />
        {opened && (
          <div className="hero-reveal">
            <p className="eyebrow">With full hearts & happy smiles</p>
            <h1>We're getting<br /><em>engaged!</em></h1>
            <div className="ornament"><span /> <Heart size={16} fill="currentColor" /> <span /></div>
            <p className="hero-sub">And we'd love to celebrate this beautiful beginning with you.</p>
            <a className="scroll-cue" href="#story">Discover your invitation <ChevronDown size={16} /></a>
          </div>
        )}
        <div className="hero-sparkle sparkle-one">✧</div><div className="hero-sparkle sparkle-two">✦</div>
      </section>

      <div className="site-content">
        <section className="intro section reveal" id="story">
          <p className="eyebrow">A love story worth celebrating</p>
          <h2>Two hearts, one <em>beautiful</em> adventure.</h2>
          <div className="photo-frame">
            <img src={`${import.meta.env.BASE_URL}couple-photo.jpg`} alt="The happy couple" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            <div className="photo-placeholder">Your favorite photo together goes here</div>
          </div>
          <p className="body-copy">Some of life's sweetest moments are made even more special when shared with the people we love. As we begin this next chapter together, we're so grateful for the family and friends who have been part of our story. We'd be delighted to have you with us for this special celebration.</p>
          <div className="signature">With love, <span>Your names here</span></div>
        </section>

        <section className="invitation section">
          <div className="section-flower">✿</div>
          <p className="eyebrow">Please join us</p>
          <h2>For an evening of<br /><em>love & celebration</em></h2>
          <p className="body-copy narrow">Together with our families, we invite you to celebrate our engagement and the beginning of our forever.</p>
          <div className="details-card">
            <div className="detail"><CalendarDays /><div><small>THE DATE</small><strong>Saturday, March 6, 2027</strong></div></div>
            <div className="detail"><Clock3 /><div><small>THE TIME</small><strong>6:00 in the evening</strong></div></div>
            <div className="detail"><MapPin /><div><small>THE PLACE</small><strong>The Shores Resort & Spa</strong><span>Daytona Beach Shores, Florida</span></div></div>
            <a className="map-link" href="https://www.google.com/maps/search/?api=1&query=The+Shores+Resort+%26+Spa+Daytona+Beach+Shores+Florida" target="_blank" rel="noreferrer">View location <span>↗</span></a>
          </div>
          <p className="kind-note"><Heart size={15} fill="currentColor" /> To help everyone enjoy the evening, we kindly request an adults-and-teens celebration for guests ages 16 and older. Thank you for understanding.</p>
        </section>

        <section className="rsvp-section section" id="rsvp">
          <p className="eyebrow">We hope you can make it</p>
          <h2>Kindly <em>reply</em></h2>
          <p className="body-copy narrow">Please let us know if you'll be joining us. We would appreciate your response at your earliest convenience.</p>
          <form className="rsvp-form" onSubmit={submit}>
            <label>Full name<input name="name" value={form.name} onChange={update} required maxLength="100" placeholder="Your name" /></label>
            <label>Email address<input name="email" type="email" value={form.email} onChange={update} required maxLength="254" placeholder="you@example.com" /></label>
            <fieldset><legend>Will you be celebrating with us?</legend>
              <label className="radio"><input type="radio" name="attendance" value="yes" checked={form.attendance === 'yes'} onChange={update} /> Joyfully accepts</label>
              <label className="radio"><input type="radio" name="attendance" value="no" checked={form.attendance === 'no'} onChange={update} /> Regretfully declines</label>
            </fieldset>
            {form.attendance === 'yes' && <label>Number of guests (including you)
              <select name="guests" value={form.guests} onChange={update}>{[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}</select>
              <small className="field-hint">Please include only guests named on your invitation.</small>
            </label>}
            <label>Dietary requirements <span className="optional">(optional)</span><input name="dietary" value={form.dietary} onChange={update} maxLength="300" placeholder="Let us know of any dietary needs" /></label>
            <label>A note for the couple <span className="optional">(optional)</span><textarea name="message" value={form.message} onChange={update} maxLength="1000" rows="3" placeholder="Leave us a little message..." /></label>
            <button className="submit-button" disabled={busy}>{busy ? 'Sending…' : 'Send RSVP'} <Heart size={16} /></button>
            {status.message && <p className={`form-status ${status.type}`} role="status">{status.type === 'success' && <CheckCircle2 size={18} />}{status.message}</p>}
          </form>
          <p className="closing">We can't wait to celebrate with you.</p>
          <div className="closing-heart"><Heart fill="currentColor" size={18} /></div>
        </section>
      </div>
      <footer>MADE WITH LOVE <span>✧</span> MARCH 6, 2027</footer>
    </main>
  )
}

export default App
