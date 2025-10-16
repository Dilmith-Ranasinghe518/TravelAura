import "./fotter.css";

export default function Footer() {
  return (
    <footer className="tne-footer">
      <div className="tne-foot-wrap">
        <div className="tne-foot-brand">
          <div className="tne-logo-mark">TE</div>
          <div>
            <h4>Travel & Explore</h4>
            <p>Compare destinations, manage bookings, and build your dream trip.</p>
          </div>
        </div>

        <div className="tne-cols">
          <div>
            <h5>Explore</h5>
            <a href="/destinations">Destinations</a>
            <a href="/deals">Deals</a>
            <a href="/guides">Travel Guides</a>
          </div>
          <div>
            <h5>Support</h5>
            <a href="/help">Help Center</a>
            <a href="/cancellations">Cancellations</a>
            <a href="/privacy">Privacy</a>
          </div>
          <div>
            <h5>Company</h5>
            <a href="/about">About</a>
            <a href="/careers">Careers</a>
            <a href="/contact">Contact</a>
          </div>
          <div>
            <h5>Newsletter</h5>
            <form className="tne-news" onSubmit={(e)=>e.preventDefault()}>
              <input type="email" placeholder="Email address" required />
              <button type="submit">Subscribe</button>
            </form>
            <div className="tne-social">
              {/* simple SVG icons to avoid extra libs */}
              <a aria-label="Facebook" href="#"><svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.4V12h2.4V9.7c0-2.4 1.4-3.8 3.6-3.8 1 0 2 .2 2 .2v2.2h-1.1c-1.1 0-1.5.7-1.5 1.4V12h2.6l-.4 2.9h-2.2v7A10 10 0 0 0 22 12z"/></svg></a>
              <a aria-label="Instagram" href="#"><svg viewBox="0 0 24 24"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2z"/></svg></a>
              <a aria-label="X" href="#"><svg viewBox="0 0 24 24"><path d="M3 3h3l6 7 6-7h3l-7.5 9L21 21h-3l-6-7-6 7H3l7.5-9z"/></svg></a>
            </div>
          </div>
        </div>

        <div className="tne-copy">
          © {new Date().getFullYear()} Travel & Explore • Built with ❤️ in Sri Lanka
        </div>
      </div>
    </footer>
  );
}
