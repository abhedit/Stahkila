import type { Metadata } from "next";
import { MorphogenesisFrame } from "@/components/sites/morphogenesis/home";
import "./privacy.css";

export const metadata: Metadata = {
  title: "Privacy Policy | Morphogenesis",
};

export default function PrivacyPolicy() {
  return (
    <MorphogenesisFrame>
      <article className="morph-wrap morph-privacy">
        <div>
          <h1>Privacy Policy</h1>
        </div>
        <div className="morph-privacy-intro">
          <p className="morph-privacy-date">Effective Date: 30/11/2025</p>
          <p>At Morphogenesis, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and secure your data when you engage with our website. It also outlines your rights regarding your personal information.</p>
        </div>
        <div className="morph-privacy-section">
          <h2>1. Information We Collect</h2>
          <p>The personal data we collect depends on how you interact with our website and the information you choose to provide. We gather information via forms, cookies, and third-party services to ensure a seamless user experience.</p>
          <ul>
            <li><b>Contact Form Information:</b> When you use our contact form, we collect your full name, email address, phone number, reason for contact, and any messages you send. You may also voluntarily provide your company name.</li>
            <li><b>Device Information:</b> We automatically collect data such as your IP address, the date and time of your visit, the duration of your session, referral URLs, the pages you visit, your browser type, and device operating system.</li>
            <li><b>Third-Party Tools:</b> We employ third-party analytics services, which collect additional usage data such as cookies, geographic location, and interaction history to help us improve website performance.</li>
          </ul>
        </div>
        <div className="morph-privacy-section">
          <h2>2. How We Use Your Information</h2>
          <p>We process your personal data for the following purposes:</p>
          <ul>
            <li><b>Interacting with You:</b> The data you provide is used to respond to your queries, process requests, and deliver the services you have subscribed to.</li>
            <li><b>Improving Website Functionality:</b> We collect and analyze device and usage information to ensure the website is functioning as intended, optimize performance, and provide a high-quality user experience. Cookies and similar tracking technologies are used to personalize and improve your browsing experience.</li>
            <li><b>Legal and Business Purposes:</b> We process your personal data to comply with legal obligations and to pursue legitimate business interests, including the defense of legal claims, compliance investigations, and regulatory purposes.</li>
          </ul>
        </div>
        <div className="morph-privacy-section">
          <h2>3. Third-Party Services</h2>
          <p>In the course of operating our website, your data may be shared with trusted third-party service providers, including:</p>
          <ul>
            <li><b>Service Providers:</b> We share data with providers who assist in hosting our website, performing analytics, and providing IT support. These providers may process personal data on our behalf to ensure the continued delivery of our services.</li>
            <li><b>Government Authorities &amp; Law Enforcement:</b> In certain circumstances, we may share your personal data with government authorities, law enforcement officials, or courts if required by law or necessary to protect our legitimate business interests.</li>
          </ul>
        </div>
        <div className="morph-privacy-section morph-privacy-compact">
          <h2>4. Cookies and Tracking Technologies</h2>
          <p>We use cookies and other tracking technologies to enhance your user experience. These technologies allow us to monitor website performance and improve functionality. Cookies may also be used to collect aggregate data on user interactions.</p>
          <p>You can manage your cookie preferences through your browser settings. However, disabling cookies may affect certain functionalities of the website.</p>
        </div>
        <div className="morph-privacy-section morph-privacy-compact">
          <h2>5. User Rights</h2>
          <p>You have specific rights regarding your personal data:</p>
          <ul>
            <li><b>Access:</b> You can request a copy of the personal data we hold about you.</li>
            <li><b>Correction:</b> You may request corrections if your data is inaccurate or incomplete.</li>
            <li><b>Deletion:</b> You have the right to request the deletion of your personal data under certain circumstances.</li>
            <li><b>Restriction of Processing:</b> You can ask us to limit how we process your data in specific cases.</li>
          </ul>
          <p>To exercise these rights, please reach out to us on <a href="mailto:contact@morphogenesis.org">contact@morphogenesis.org</a>.</p>
        </div>
        <div className="morph-privacy-section morph-privacy-compact">
          <h2>6. Data Security</h2>
          <p>We are committed to protecting your personal data and employ a range of technical and organizational measures to safeguard your information from unauthorized access, loss, or alteration. These include encryption, secure servers, and access controls.</p>
          <p>While we take reasonable steps to protect your data, please note that any transmission over the internet carries inherent risks. Once we receive your data, we apply strict measures to secure it.</p>
        </div>
        <div className="morph-privacy-section morph-privacy-compact">
          <h2>7. International Data Transfers</h2>
          <p>Our website is accessible globally, and we may transfer your personal data to service providers in countries outside your own. Such transfers are made in compliance with applicable data protection regulations to ensure that your data remains protected.</p>
        </div>
        <div className="morph-privacy-section morph-privacy-compact">
          <h2>8. Children’s Privacy</h2>
          <p>Our website and services are not intended for use by individuals under the age of 13. We do not knowingly collect personal data from children. If we become aware of such data being collected, we will take immediate steps to delete it.</p>
        </div>
        <div className="morph-privacy-section morph-privacy-compact">
          <h2>9. Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for regulatory reasons. The “Effective Date” at the top of this policy will be updated accordingly. We recommend reviewing this policy periodically to stay informed of how we are protecting your personal data.</p>
        </div>
        <div className="morph-privacy-section morph-privacy-compact">
          <h2>10. Contact Information</h2>
          <p>If you have any questions or concerns about our privacy practices or would like to exercise your rights, please reach out to us on <a href="mailto:contact@morphogenesis.org">contact@morphogenesis.org</a>.</p>
        </div>
      </article>
    </MorphogenesisFrame>
  );
}
