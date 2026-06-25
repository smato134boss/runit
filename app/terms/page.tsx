export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#F97316", letterSpacing: "-1px" }}>Runly</span>
        </a>
        <a href="/register" style={{ fontSize: 14, color: "#78716C", textDecoration: "none" }}>← Back</a>
      </nav>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1C1917", letterSpacing: "-1px", marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ fontSize: 14, color: "#A8A29E", marginBottom: 32 }}>Last updated: June 2026</p>

        {/* Marketplace disclaimer — prominent */}
        <div style={{ backgroundColor: "#1C1917", color: "white", borderRadius: 16, padding: "24px 28px", marginBottom: 48 }}>
          <p style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#F97316", marginBottom: 10 }}>
            Important — Platform Notice
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.8, margin: 0 }}>
            <strong>Runly is a technology platform and marketplace intermediary only.</strong> Runly does not provide, perform, or guarantee any tasks or services listed on the platform. All tasks are performed by independent users ("Runners") who are not employees, agents, or contractors of Runly. Any agreement for services is made solely between the Poster and the Runner. Runly bears no responsibility for the quality, safety, legality, or completion of any task. By using this platform, you acknowledge that Runly acts solely as a neutral intermediary and payment facilitator.
          </p>
        </div>

        <Section title="1. Acceptance of Terms">
          By creating an account on Runly, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform. Runly is operated in Canada and these terms are governed by the laws of Ontario.
        </Section>

        <Section title="2. The Platform — Intermediary Role">
          Runly is a peer-to-peer marketplace that connects people who need tasks done ("Posters") with people willing to do them ("Runners"). <strong>Runly is not a party to any service agreement between Posters and Runners, does not employ Runners, and does not control how tasks are performed.</strong> Runners are independent individuals acting on their own behalf. Runly's role is limited to providing the technology platform and facilitating secure payments between users.
        </Section>

        <Section title="3. Eligibility">
          You must be at least 18 years old and legally able to enter contracts in Canada to use Runly. By registering, you confirm that all information you provide is accurate and complete.
        </Section>

        <Section title="4. User Accounts">
          <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
            <li>One account per person. Creating multiple accounts to circumvent bans or fees is prohibited.</li>
            <li>You are responsible for maintaining the security of your account.</li>
            <li>You must use a real name and valid contact information.</li>
            <li>Runly reserves the right to suspend or terminate accounts that violate these terms.</li>
          </ul>
        </Section>

        <Section title="5. Posting and Running Tasks">
          <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
            <li>Posters must accurately describe the task, location, and budget.</li>
            <li>Runners must only accept tasks they are capable of completing.</li>
            <li>Tasks involving illegal activities, hazardous materials, or deception are strictly prohibited.</li>
            <li>Runners must not solicit payment outside the platform.</li>
          </ul>
        </Section>

        <Section title="6. Payments and Fees">
          <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
            <li>All payments are processed securely through Stripe.</li>
            <li>When a Poster accepts a bid, funds are held in escrow until the task is confirmed complete.</li>
            <li>Runly charges a platform fee of 15% on each completed task, deducted from the Runner's payout.</li>
            <li>Refunds are issued at Runly's discretion in cases of non-performance or fraud.</li>
            <li>All prices are in Canadian Dollars (CAD) and are subject to applicable taxes.</li>
          </ul>
        </Section>

        <Section title="7. Cancellations and Disputes">
          <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
            <li>A Poster may cancel a task before a bid is accepted at no charge.</li>
            <li>Once payment is in escrow, cancellation requests are reviewed by Runly support.</li>
            <li>In case of a dispute, both parties must provide evidence. Runly's decision is final.</li>
          </ul>
        </Section>

        <Section title="8. Prohibited Conduct">
          Users must not: harass, threaten, or harm other users; post false or misleading information; attempt to circumvent platform fees; use the platform for any unlawful purpose; or interfere with the platform's security or functionality.
        </Section>

        <Section title="9. Limitation of Liability">
          Runly is not liable for any damages arising from transactions between users, including loss of property, personal injury, or financial loss. Use the platform at your own risk. Runly's total liability to any user shall not exceed the fees paid to Runly in the 3 months prior to the claim.
        </Section>

        <Section title="10. Changes to Terms">
          Runly may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms. Material changes will be communicated by email.
        </Section>

        <Section title="11. Contact">
          For questions about these terms, contact us at: <strong>support@runly.ca</strong>
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
