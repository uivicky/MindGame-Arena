import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs, buildBreadcrumbSchema } from '../components/Breadcrumbs';
import { SeoHead, getSiteBaseUrl } from '../components/SeoHead';

function LegalLayout({
  title,
  description,
  canonicalPath,
  updatedDate,
  children,
}: {
  title: string;
  description: string;
  canonicalPath: string;
  updatedDate: string;
  children: React.ReactNode;
}) {
  const breadcrumbItems = useMemo(
    () => [{ label: 'Home', to: '/' }, { label: title }],
    [title]
  );

  const schemas = useMemo(() => {
    const baseUrl = getSiteBaseUrl();
    return [buildBreadcrumbSchema(breadcrumbItems, baseUrl)];
  }, [breadcrumbItems]);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <SeoHead
        title={`${title} — MindGame Arena`}
        description={description}
        canonicalPath={canonicalPath}
        schemas={schemas}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <header className="pb-6 border-b border-[#E5E7EB] dark:border-[#262A35]">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717] dark:text-[#F4F4F6]">
          {title}
        </h1>
        <p className="mt-2 text-xs text-[#666666] dark:text-[#A1A1AA]">
          Last updated: {updatedDate}
        </p>
      </header>
      <div className="mt-8 space-y-6 text-sm sm:text-base text-[#171717]/90 dark:text-[#F4F4F6]/90 leading-[1.75]">
        {children}
      </div>
    </div>
  );
}

export function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="MindGame Arena privacy policy explaining browser LocalStorage persistence and optional Google AdSense disclosures."
      canonicalPath="/privacy-policy"
      updatedDate="November 2026"
    >
      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-[#171717] dark:text-[#F4F4F6]">
          1. Local Browser Storage &amp; Contact Submissions
        </h2>
        <p>
          MindGame Arena does not require account registration and does not transmit your game
          scores, reaction timings, or daily streaks to a central server. All personal statistics
          are saved exclusively in your browser&apos;s LocalStorage and can be erased at any time
          via the My Stats page. If you choose to submit a message through the Contact page when a
          live form endpoint is configured by the site operator, only the fields you enter (name,
          email address, topic, and message) are transmitted to that endpoint.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-[#171717] dark:text-[#F4F4F6]">
          2. Advertising &amp; Third-Party Vendors
        </h2>
        <p>
          When configured by the site publisher with a valid Google AdSense publisher ID, Google and
          its advertising partners may set cookies or use device identifiers to serve ads based on
          prior visits to this website or other sites, in accordance with Google&apos;s advertising
          policies. When AdSense is not configured, no advertising scripts are loaded.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-[#171717] dark:text-[#F4F4F6]">
          3. Contact
        </h2>
        <p>
          For privacy inquiries, please reach out through our{' '}
          <Link to="/contact" className="text-[#F97316] font-medium hover:underline">
            Contact Us
          </Link>{' '}
          page.
        </p>
      </section>
    </LegalLayout>
  );
}

export function TermsPage() {
  return (
    <LegalLayout
      title="Terms and Conditions"
      description="Terms of use for MindGame Arena online mind games and educational guides."
      canonicalPath="/terms"
      updatedDate="November 2026"
    >
      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-[#171717] dark:text-[#F4F4F6]">
          1. Educational &amp; Practice Purpose
        </h2>
        <p>
          MindGame Arena provides interactive memory, attention, reasoning, and speed games solely
          for personal cognitive practice, entertainment, and educational exploration.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-[#171717] dark:text-[#F4F4F6]">
          2. Acceptable Use
        </h2>
        <p>
          You agree not to automate artificial clicks, scrape content for redistribution, or
          interfere with advertising placements or normal site operation.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-[#171717] dark:text-[#F4F4F6]">
          3. Availability &amp; Warranty
        </h2>
        <p>
          The platform is provided on an &ldquo;as is&rdquo; basis without warranties of
          uninterrupted availability or data persistence if browser storage is cleared.
        </p>
      </section>
    </LegalLayout>
  );
}

export function DisclaimerPage() {
  return (
    <LegalLayout
      title="Medical & Practice Disclaimer"
      description="Clarification that MindGame Arena is an educational gaming platform and not a medical or clinical diagnostic service."
      canonicalPath="/disclaimer"
      updatedDate="November 2026"
    >
      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-[#171717] dark:text-[#F4F4F6]">
          Not Medical Advice
        </h2>
        <p>
          MindGame Arena is not a medical device, clinical assessment tool, or healthcare provider.
          The games, reaction speed measurements, and educational articles on this website do not
          diagnose, treat, cure, or prevent any neurological or medical condition.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-[#171717] dark:text-[#F4F4F6]">
          Honest Interpretation of Results
        </h2>
        <p>
          Higher scores on MindGame Arena games reflect familiarity and practice with these specific
          tasks. Consult a qualified healthcare professional if you have concerns regarding memory,
          attention, or cognitive health.
        </p>
      </section>
    </LegalLayout>
  );
}

export function CookiePolicyPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      description="Information about browser LocalStorage preferences and optional advertising cookies on MindGame Arena."
      canonicalPath="/cookie-policy"
      updatedDate="November 2026"
    >
      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-[#171717] dark:text-[#F4F4F6]">
          1. Essential LocalStorage Keys
        </h2>
        <p>
          MindGame Arena stores your theme preference (
          <code className="font-mono">mindgame_arena_theme</code>) and game history (
          <code className="font-mono">mindgame_arena_progress_v1</code>) locally in your browser,
          and reads prior <code className="font-mono">neurofit_*</code> keys solely to preserve
          existing local progress. These entries remain on your device and are not transmitted to
          external servers.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-xl font-bold text-[#171717] dark:text-[#F4F4F6]">
          2. Advertising Cookies
        </h2>
        <p>
          If the site operator enables Google AdSense, third-party vendors including Google may
          use cookies to serve ads based on prior visits. You can manage advertising preferences
          through Google&apos;s Ad Settings or browser cookie controls.
        </p>
      </section>
    </LegalLayout>
  );
}
