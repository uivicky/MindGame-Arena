import { AlertCircle, CheckCircle2, Loader2, Mail } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Breadcrumbs, buildBreadcrumbSchema } from '../components/Breadcrumbs';
import { SeoHead, getSiteBaseUrl } from '../components/SeoHead';

const CONTACT_EMAIL = (import.meta.env.VITE_CONTACT_EMAIL as string | undefined)?.trim() || '';
const PRIVACY_EMAIL = (import.meta.env.VITE_PRIVACY_EMAIL as string | undefined)?.trim() || '';
const FORM_ENDPOINT =
  (import.meta.env.VITE_CONTACT_FORM_ENDPOINT as string | undefined)?.trim() || '';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('General Feedback');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isEndpointConfigured = Boolean(FORM_ENDPOINT && /^https?:\/\//i.test(FORM_ENDPOINT));

  const breadcrumbItems = useMemo(
    () => [{ label: 'Home', to: '/' }, { label: 'Contact Us' }],
    []
  );

  const schemas = useMemo(() => {
    const baseUrl = getSiteBaseUrl();
    return [buildBreadcrumbSchema(breadcrumbItems, baseUrl)];
  }, [breadcrumbItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (name.trim().length < 2) {
      setError('Please enter your name (at least 2 characters).');
      return;
    }
    if (!emailValid) {
      setError('Please enter a valid email address.');
      return;
    }
    if (message.trim().length < 10) {
      setError('Please include a message of at least 10 characters.');
      return;
    }

    if (!isEndpointConfigured) {
      setError(
        'Contact form delivery is not enabled on this build because VITE_CONTACT_FORM_ENDPOINT is not configured.'
      );
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: trimmedEmail,
          topic,
          message: message.trim(),
          source: 'MindGame Arena Contact Form',
        }),
      });

      if (!response.ok) {
        throw new Error(`Submission returned status ${response.status}`);
      }

      setSubmitted(true);
    } catch {
      setError(
        'Unable to send your message right now. Please try again later or reach out via the published email address.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <SeoHead
        title="Contact Us — MindGame Arena"
        description="Contact MindGame Arena regarding game feedback, accessibility inquiries, privacy questions, or editorial notes."
        canonicalPath="/contact"
        schemas={schemas}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <div className="pb-8 border-b border-[#E5E7EB] dark:border-[#262A35]">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717] dark:text-[#F4F4F6]">
          Contact Us
        </h1>
        <p className="mt-2.5 text-sm sm:text-base text-[#666666] dark:text-[#A1A1AA] max-w-2xl">
          Share feedback on exercises, report an accessibility issue, or reach out with editorial or
          privacy questions.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6">
            <h2 className="font-display text-lg font-bold text-[#171717] dark:text-[#F4F4F6]">
              Support Channels
            </h2>
            <p className="mt-1.5 text-xs text-[#666666] dark:text-[#A1A1AA]">
              Direct publisher email addresses and inquiry routing
            </p>
            <div className="mt-5 space-y-4 text-sm">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#F97316] mt-0.5 shrink-0" />
                <div>
                  <span className="block font-medium text-[#171717] dark:text-[#F4F4F6]">
                    General &amp; Support
                  </span>
                  {CONTACT_EMAIL ? (
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="font-mono text-xs text-[#EA580C] dark:text-[#FB923C] hover:underline break-all"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  ) : (
                    <span className="font-mono text-xs text-[#666666] dark:text-[#A1A1AA]">
                      Not yet configured (set VITE_CONTACT_EMAIL)
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#F97316] mt-0.5 shrink-0" />
                <div>
                  <span className="block font-medium text-[#171717] dark:text-[#F4F4F6]">
                    Privacy &amp; Compliance
                  </span>
                  {PRIVACY_EMAIL ? (
                    <a
                      href={`mailto:${PRIVACY_EMAIL}`}
                      className="font-mono text-xs text-[#EA580C] dark:text-[#FB923C] hover:underline break-all"
                    >
                      {PRIVACY_EMAIL}
                    </a>
                  ) : (
                    <span className="font-mono text-xs text-[#666666] dark:text-[#A1A1AA]">
                      Not yet configured (set VITE_PRIVACY_EMAIL)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 rounded-2xl border border-[#E5E7EB] dark:border-[#262A35] bg-white dark:bg-[#1B1E25] p-6 sm:p-8">
          {submitted ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h2 className="mt-3 font-display text-xl font-bold text-[#171717] dark:text-[#F4F4F6]">
                Inquiry Sent
              </h2>
              <p className="mt-2 text-sm text-[#666666] dark:text-[#A1A1AA] max-w-md mx-auto">
                Thank you, {name}. Your message has been forwarded to our configured contact inbox.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setMessage('');
                }}
                className="mt-6 min-h-[42px] px-5 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#262A35] text-sm font-semibold hover:border-[#F97316] transition-colors"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {!isEndpointConfigured && (
                <div
                  role="status"
                  className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3.5 flex items-start gap-2.5 text-xs text-[#171717] dark:text-[#F4F4F6]"
                >
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Live form endpoint not configured</p>
                    <p className="mt-0.5 text-[#666666] dark:text-[#A1A1AA]">
                      Set <code className="font-mono">VITE_CONTACT_FORM_ENDPOINT</code> (and{' '}
                      <code className="font-mono">VITE_CONTACT_EMAIL</code> /{' '}
                      <code className="font-mono">VITE_PRIVACY_EMAIL</code>) in your deployment
                      environment before enabling live submissions.
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium mb-1.5">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] text-sm focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium mb-1.5">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] text-sm focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div>
                <label htmlFor="contact-topic" className="block text-sm font-medium mb-1.5">
                  Topic
                </label>
                <select
                  id="contact-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] text-sm focus:outline-none focus:border-[#F97316]"
                >
                  <option>General Feedback</option>
                  <option>Exercise Bug Report</option>
                  <option>Accessibility Inquiry</option>
                  <option>Privacy / Advertising</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium mb-1.5">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details of your question or feedback..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] dark:border-[#262A35] bg-[#F8F8FA] dark:bg-[#111318] text-sm focus:outline-none focus:border-[#F97316]"
                />
              </div>

              {error && (
                <p role="alert" className="text-xs font-medium text-rose-500">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!isEndpointConfigured || submitting}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 rounded-lg bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? 'Sending...' : 'Submit Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
