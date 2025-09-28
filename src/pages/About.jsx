import React from 'react'

export default function About() {
  return (
    <div className="grid gap-6">
      {/* Hero */}
      <section className="card p-6">
        <h1 className="text-2xl font-semibold">About CureBot</h1>
        <p className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
          CureBot is your conversational health companion. We help you understand symptoms, organize your health
          information, and prepare for clinical care. CureBot does not replace a doctor; it complements your journey
          with timely, reliable guidance and accessible tools.
        </p>
        {/* Disclaimer: dummy data notice */}
        <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 text-sm p-3 dark:bg-[#1F1A0E] dark:text-amber-200 dark:border-amber-700">
          Disclaimer: This site currently uses dummy/test data. Features and information are for demonstration only.
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800 border border-emerald-200">Privacy-first</span>
          <span className="px-3 py-1 rounded-full text-xs bg-sky-100 text-sky-800 border border-sky-200">24/7 guidance</span>
          <span className="px-3 py-1 rounded-full text-xs bg-violet-100 text-violet-800 border border-violet-200">Accessibility</span>
        </div>
        {/* stats removed per request */}
      </section>

      {/* Mission */}
      <section className="card p-6">
        <h2 className="text-lg font-semibold">Mission</h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
          Make trustworthy, compassionate health guidance accessible to everyone, anytime.
        </p>
      </section>

      {/* What we do */}
      <section className="card p-6">
        <h2 className="text-lg font-semibold">What we do</h2>
        <ul className="mt-2 grid gap-2 text-gray-700 dark:text-gray-300 list-disc pl-5">
          <li>Symptom guidance and suggested next steps.</li>
          <li>Personalized insights using your profile (age, gender, height, weight, BMI, health conditions).</li>
          <li>Profile and medical report storage so your information stays organized.</li>
          <li>Accessibility options and inclusive design for users with physical limitations.</li>
        </ul>
      </section>

      {/* How CureBot helps */}
      <section className="card p-6">
        <h2 className="text-lg font-semibold">How CureBot helps</h2>
        <div className="mt-3 grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border p-4 dark:bg-[#16181a] dark:border-[#2E2F33]">
            <h3 className="font-medium">Clarity</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">Simple language, clear actions, and escalation when risk is high.</p>
          </div>
          <div className="rounded-xl border p-4 dark:bg-[#16181a] dark:border-[#2E2F33]">
            <h3 className="font-medium">Personalization</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">Considers BMI, age, gender, conditions and accessibility preferences.</p>
          </div>
          <div className="rounded-xl border p-4 dark:bg-[#16181a] dark:border-[#2E2F33]">
            <h3 className="font-medium">Organization</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">Keep notes and reports in one place for quicker clinical visits.</p>
          </div>
          <div className="rounded-xl border p-4 dark:bg-[#16181a] dark:border-[#2E2F33]">
            <h3 className="font-medium">Availability</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">24/7 access so help is there when you need it.</p>
          </div>
        </div>
      </section>

      {/* Mentors */}
      <section className="card p-6">
        <h2 className="text-lg font-semibold">Mentor</h2>
        <div className="mt-3 rounded-xl border p-4 flex items-start gap-4 dark:bg-[#16181a] dark:border-[#2E2F33]">
          <div className="w-12 h-12 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 dark:bg-[#0A3A56] dark:border-[#0A3A56] dark:text-sky-200">👨‍⚕️</div>
          <div className="flex-1">
            <div className="font-medium">Dr. Tanmay Pawar</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Mentor</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <a className="btn-outline !px-3 !py-1" href="tel:9428807640">Call</a>
              <a className="btn-outline !px-3 !py-1" href="mailto:tdpawar@bvmengineering.ac.in">Email</a>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Phone: 9428807640 · Email: <a className="text-sky-700 dark:text-sky-400 hover:underline" href="mailto:tdpawar@bvmengineering.ac.in">tdpawar@bvmengineering.ac.in</a></div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="card p-6">
        <h2 className="text-lg font-semibold">Contact</h2>
        <div className="mt-2 grid md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <div className="rounded-xl border p-4 dark:bg-[#16181a] dark:border-[#2E2F33]">
            <div className="font-medium">Primary Contact</div>
            <div className="text-sm mt-1">Alfaj Asif</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <a className="btn-outline !px-3 !py-1" href="tel:9662051150">Call</a>
              <a className="btn-outline !px-3 !py-1" href="mailto:alfajasif76@gmail.com">Email</a>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Phone: <a className="text-sky-700 dark:text-sky-400 hover:underline" href="tel:9662051150">9662051150</a> · Email: <a className="text-sky-700 dark:text-sky-400 hover:underline" href="mailto:alfajasif76@gmail.com">alfajasif76@gmail.com</a></div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="card p-6 text-center">
        <h2 className="text-lg font-semibold">Ready to get started?</h2>
        <p className="text-gray-700 dark:text-gray-300 mt-1">Create your profile and start a chat with CureBot.</p>
        <a className="btn mt-3 inline-block" href="/">Start now</a>
      </section>

      {/* Documents removed per request */}
    </div>
  )
}
