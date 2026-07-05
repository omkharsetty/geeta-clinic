import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PCOS Specialist in Ongole",
  description:
    "PCOS and hormonal care in Ongole with endocrine-led treatment for menstrual irregularity, insulin resistance, and hormonal imbalance.",
  alternates: {
    canonical: "/services/pcos-hormonal-care",
  },
};

export default function PcosHormonalCarePage() {
  return (
    <main className="service-page">
      <section className="container service-body">
        <div className="section-head">
          <p className="kicker">PCOS and Hormones</p>
          <h1>PCOS and hormonal care in Ongole</h1>
        </div>
        <article className="service-block">
          <h2>When to seek consultation</h2>
          <ul className="service-list">
            <li>Irregular periods and cycle disturbances</li>
            <li>Weight gain with suspected hormonal causes</li>
            <li>Acne, hair growth changes, or fertility concerns</li>
          </ul>
        </article>
        <article className="service-block">
          <h2>What we focus on</h2>
          <p>
            Comprehensive endocrine assessment with individualized treatment plans for hormone balance, metabolism, and long-term symptom control.
          </p>
        </article>
        <article className="service-block">
          <h2>Book your consultation</h2>
          <p>
            Call <a href="tel:+919603062942">+91 96030 62942</a> or connect on WhatsApp to schedule PCOS consultation.
          </p>
        </article>
        <p>
          <Link href="/services" className="service-cta">Back to all services</Link>
        </p>
      </section>
    </main>
  );
}
