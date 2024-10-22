"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const [openFAQs, setOpenFAQs] = useState<number[]>([]);

  const toggleFAQ = (index: number) => {
    setOpenFAQs((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "What is Civix?",
      answer:
        "Civix is an AI-powered platform designed to streamline the proposal process for government contractors, helping them create high-quality proposals in hours instead of days.",
    },
    {
      question: "How does Civix work?",
      answer:
        "Civix uses advanced AI algorithms to analyze your past proposals and industry best practices. It then generates a tailored first draft based on the specific requirements of your current proposal, significantly reducing the time and effort required in the initial stages of proposal writing.",
    },
    {
      question: "Is Civix secure and compliant with government standards?",
      answer:
        "Yes, Civix is built with the highest security standards in mind. We are compliant with NIST 800-171, SOC2 Type II, CMMC, and FedRAMP, ensuring that your sensitive data is protected and meets all necessary government regulations.",
    },
  ];

  return (
    <>
      {/* Sticky Header and Auth Buttons */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="text-2xl font-bold text-teal-600">Civix</div>
          <div className="space-x-4">
            <Link href="/auth">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/auth">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Proposals for government contractors in hours, not days
          </h1>
          <p className="text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
            Civix streamlines the proposal process with AI-powered tools and templates
          </p>
          <Link href="/auth">
            <Button size="lg" className="bg-black hover:bg-black text-white">
              Get Started
            </Button>
          </Link>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-center">
            <img src="/placeholder.svg?height=30&width=100" alt="Client logo" className="mx-auto" />
            {/* Add more logos as needed */}
          </div>
        </section>

        {/* Feature Highlight Section */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Supercharge your GovCon's proposal efforts
            </h2>
            <Card className="bg-teal-600 text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Generate a complete first-draft in 60 minutes, not 60 hours
                </h3>
                <p className="mb-6">
                  Our AI-powered system analyzes your past proposals and creates a tailored draft in record time.
                </p>
                <Button variant="secondary" className="bg-white text-teal-600 hover:bg-gray-100">
                  Request Demo
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">A Powerful Suite of Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                "AI-Powered Draft Generation",
                "Customizable Templates",
                "Collaborative Editing",
                "Version Control",
                "Compliance Checker",
                "Automated Formatting",
              ].map((feature, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>{feature}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Enhance your proposal process with our {feature.toLowerCase()} feature, designed to streamline and improve your government contracting efforts.</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently asked questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>
                      <button
                        className="flex justify-between items-center w-full text-left"
                        onClick={() => toggleFAQ(index)}
                        aria-expanded={openFAQs.includes(index)}
                        aria-controls={`faq-answer-${index}`}
                      >
                        {faq.question}
                        {openFAQs.includes(index) ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </CardTitle>
                  </CardHeader>
                  {openFAQs.includes(index) && (
                    <CardContent id={`faq-answer-${index}`}>
                      <p>{faq.answer}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Unleash the Power of AI for Your Proposals</h2>
            <div className="space-x-4">
              <Link href="/auth">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white">
                  Get Started
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Book a Call
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}