import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thyroid Specialist in Ongole",
  description:
    "Expert thyroid care in Ongole for hypothyroidism, hyperthyroidism, thyroid nodules, and autoimmune thyroid conditions.",
  alternates: {
    canonical: "/services/thyroid-disorders",
  },
};

export default function ThyroidDisordersPage() {
  return (
    <main className="service-page">
      <section className="container service-body">
        <div className="section-head">
          <p className="kicker">Thyroid Care</p>
          <h1>Thyroid disorder treatment in Ongole</h1>
        </div>
        <article className="service-block">
          <h2>Conditions treated</h2>
          <ul className="service-list">
            <li>Hypothyroidism and hyperthyroidism</li>
            <li>Hashimoto's and Graves' disease</li>
            <li>Thyroid nodules and thyroid function imbalance</li>
          </ul>
        </article>
        <article className="service-block">
          <h2>Our approach</h2>
          <p>
            Detailed symptom review, appropriate lab interpretation, and practical long-term medication and monitoring plans.
          </p>
        </article>
        <article className="service-block">
          <h2>Book your consultation</h2>
          <p>
            Call <a href="tel:+919603062942">+91 96030 62942</a> or contact via WhatsApp for thyroid consultation appointments.
          </p>
        </article>
        <p>
          <Link href="/services" className="service-cta">Back to all services</Link>
        </p>
      </section>
    </main>
  );
}
