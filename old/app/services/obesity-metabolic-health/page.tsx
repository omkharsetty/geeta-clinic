import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Obesity and Metabolic Specialist in Ongole",
  description:
    "Medical obesity and metabolic health care in Ongole focused on endocrine causes, insulin resistance, and sustainable outcomes.",
  alternates: {
    canonical: "/services/obesity-metabolic-health",
  },
};

export default function ObesityMetabolicHealthPage() {
  return (
    <main className="service-page">
      <section className="container service-body">
        <div className="section-head">
          <p className="kicker">Metabolic Care</p>
          <h1>Obesity and metabolic health care in Ongole</h1>
        </div>
        <article className="service-block">
          <h2>Who can benefit</h2>
          <ul className="service-list">
            <li>Patients with obesity and insulin resistance</li>
            <li>Metabolic syndrome and prediabetes risk</li>
            <li>Hormonal contributors to persistent weight gain</li>
          </ul>
        </article>
        <article className="service-block">
          <h2>Care strategy</h2>
          <p>
            Evidence-based medical management with realistic nutrition, activity, and follow-up plans for long-term metabolic improvement.
          </p>
        </article>
        <article className="service-block">
          <h2>Book your consultation</h2>
          <p>
            Call <a href="tel:+919603062942">+91 96030 62942</a> or use WhatsApp to schedule metabolic health consultation.
          </p>
        </article>
        <p>
          <Link href="/services" className="service-cta">Back to all services</Link>
        </p>
      </section>
    </main>
  );
}
