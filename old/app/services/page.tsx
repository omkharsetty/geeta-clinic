import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Endocrinology Services in Ongole",
  description:
    "Explore diabetes, thyroid, PCOS, and obesity endocrine services by Dr. Geeta Annamaneni in Ongole.",
  alternates: {
    canonical: "/services",
  },
};

const services = [
  {
    href: "/services/diabetes-management",
    title: "Diabetes Management",
    desc: "Type 1, Type 2, and gestational diabetes treatment with evidence-based monitoring and medication support.",
  },
  {
    href: "/services/thyroid-disorders",
    title: "Thyroid Disorders",
    desc: "Diagnosis and treatment for hypothyroidism, hyperthyroidism, thyroid nodules, and autoimmune thyroid disease.",
  },
  {
    href: "/services/pcos-hormonal-care",
    title: "PCOS and Hormonal Care",
    desc: "Structured endocrine care for PCOS, menstrual irregularity, insulin resistance, and hormonal imbalance.",
  },
  {
    href: "/services/obesity-metabolic-health",
    title: "Obesity and Metabolic Health",
    desc: "Medical weight and metabolic risk care designed to improve long-term endocrine and cardiometabolic outcomes.",
  },
];

export default function ServicesPage() {
  return (
    <main className="service-page">
      <section className="container">
        <div className="section-head">
          <p className="kicker">Service Pages</p>
          <h1>Endocrinology and diabetes services in Ongole</h1>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <Link key={service.href} href={service.href} className="service service-link">
              <h2>{service.title}</h2>
              <p>{service.desc}</p>
              <span className="service-cta">View service page</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
