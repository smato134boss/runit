export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>Runly</span>
        </a>
        <a href="/register" style={{ fontSize: 14, color: "#78716C", textDecoration: "none" }}>← Back</a>
      </nav>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px", marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontSize: 14, color: "#A8A29E", marginBottom: 48 }}>Last updated: June 2026</p>

        <p style={{ fontSize: 15, color: "#44403C", lineHeight: 1.8, marginBottom: 40, padding: "20px 24px", backgroundColor: "#FFF7ED", borderRadius: 12, border: "1px solid #FED7AA" }}>
          Runly is committed to protecting your privacy in accordance with Canada's <strong>Personal Information Protection and Electronic Documents Act (PIPEDA)</strong> and applicable provincial privacy laws.
        </p>

        <Section title="1. Information We Collect">
          <strong>Information you provide:</strong>
          <ul style={{ paddingLeft: 20, lineHeight: 2, marginTop: 8 }}>
            <li>Name, email address, phone number, and city upon registration</li>
            <li>Profile information including bio and profile photo</li>
            <li>Task details, bid amounts, and messages exchanged on the platform</li>
            <li>Payment information (processed by Stripe — we do not store card details)</li>
            <li>Reviews and ratings you submit</li>
          </ul>
          <strong style={{ display: "block", marginTop: 16 }}>Information collected automatically:</strong>
          <ul style={{ paddingLeft: 20, lineHeight: 2, marginTop: 8 }}>
            <li>Device type, browser, and IP address</li>
            <li>Pages visited and actions taken on the platform</li>
            <li>Session data and cookies</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
            <li>To provide, operate, and improve the Runly platform</li>
            <li>To facilitate transactions between Posters and Runners</li>
            <li>To send transactional emails (new bids, task updates, payment confirmations)</li>
            <li>To verify identity and prevent fraud</li>
            <li>To resolve disputes between users</li>
            <li>To comply with legal obligations</li>
          </ul>
          We do not sell your personal information to third parties.
        </Section>

        <Section title="3. Information Sharing">
          We share your information only in the following cases:
          <ul style={{ paddingLeft: 20, lineHeight: 2, marginTop: 8 }}>
            <li><strong>With other users:</strong> Your name, city, rating, and reviews are visible to other users. Your contact details are only shared after a task agreement is reached.</li>
            <li><strong>With service providers:</strong> Stripe (payments), Supabase (database), Vercel (hosting), Resend (email). These providers are bound by confidentiality agreements.</li>
            <li><strong>For legal compliance:</strong> When required by law, court order, or to protect the rights of Runly and its users.</li>
          </ul>
        </Section>

        <Section title="4. Data Retention">
          We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting <strong>support@runly.ca</strong>. Some data may be retained for legal or fraud prevention purposes for up to 7 years.
        </Section>

        <Section title="5. Your Rights (PIPEDA)">
          Under PIPEDA, you have the right to:
          <ul style={{ paddingLeft: 20, lineHeight: 2, marginTop: 8 }}>
            <li>Access the personal information we hold about you</li>
            <li>Correct inaccurate information</li>
            <li>Withdraw consent for non-essential data processing</li>
            <li>Request deletion of your account and data</li>
            <li>File a complaint with the Office of the Privacy Commissioner of Canada</li>
          </ul>
          To exercise these rights, contact us at <strong>support@runly.ca</strong>.
        </Section>

        <Section title="6. Cookies">
          Runly uses essential cookies for authentication and session management. We do not use advertising or tracking cookies. You can disable cookies in your browser settings, but this may affect platform functionality.
        </Section>

        <Section title="7. Security">
          We use industry-standard security measures including encrypted connections (HTTPS), row-level security on our database, and secure third-party payment processing. However, no system is 100% secure — report any vulnerabilities to <strong>security@runly.ca</strong>.
        </Section>

        <Section title="8. Children's Privacy">
          Runly is not intended for users under 18 years of age. We do not knowingly collect personal information from minors.
        </Section>

        <Section title="9. Changes to This Policy">
          We may update this policy from time to time. We will notify you of material changes by email. Continued use of Runly after changes constitutes acceptance of the updated policy.
        </Section>

        <Section title="10. Contact">
          For privacy-related questions or requests:<br />
          <strong>Email:</strong> support@runly.ca<br />
          <strong>Privacy Officer:</strong> Runly Canada Inc.
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1C1917", marginBottom: 12 }}>{title}</h2>
      <div style={{ fontSize: 15, color: "#44403C", lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}
