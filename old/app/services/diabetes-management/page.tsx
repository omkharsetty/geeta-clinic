import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Diabetes Doctor in Ongole",
  description:
    "Specialist diabetes management in Ongole for Type 1, Type 2, and gestational diabetes by Dr. Geeta Annamaneni.",
  alternates: {
    canonical: "/services/diabetes-management",
  },
};

export default function DiabetesManagementPage() {
  return (
    <main className="service-page">
      <section className="container service-body">
        <div className="section-head">
          <p className="kicker">Diabetes Care</p>
          <h1>Diabetes management in Ongole</h1>
        </div>
        <article className="service-block">
          <h2>Who this is for</h2>
          <p>
            Patients with Type 1 diabetes, Type 2 diabetes, gestational diabetes, or difficult-to-control blood sugar levels.
          </p>
        </article>
        <article className="service-block">
          <h2>What is included</h2>
          <ul className="service-list">
            <li>Personalized medication and insulin planning</li>
            <li>Diet and activity guidance based on routine</li>
            <li>Blood sugar pattern review and follow-up strategy</li>
            <li>Complication risk reduction and long-term monitoring</li>
          </ul>
        </article>
        <article className="service-block">
          <h2>Book your consultation</h2>
          <p>
            Call <a href="tel:+919603062942">+91 96030 62942</a> or book via WhatsApp for diabetes consultation slots.
          </p>
        </article>
        <p>
          <Link href="/services" className="service-cta">Back to all services</Link>
        </p>
      </section>
    </main>
  );
}
