"use client";

import { useActionState } from "react";
import { submitContact } from "./actions";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    return submitContact(formData);
  }, null);

  if (state?.success) {
    return (
      <div className="contact-form-wrap" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
        <p className="eyebrow" style={{ color: 'var(--orchid)' }}>Thank you!</p>
        <h3 style={{ margin: '0 0 16px' }}>Message received</h3>
        <p style={{ color: 'var(--muted)', margin: 0 }}>
          We appreciate you getting in touch. We&apos;ll get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <div className="contact-form-wrap">
      <p className="eyebrow">Send a message</p>
      <form action={formAction} className="form" style={{ marginTop: 24 }}>
        {state?.error && (
          <p className="danger" style={{ marginBottom: 16 }}>{state.error}</p>
        )}
        <label>
          Name
          <input type="text" name="name" required disabled={isPending} />
        </label>
        <label>
          Email
          <input type="email" name="email" required disabled={isPending} />
        </label>
        <label>
          Message
          <textarea name="message" rows={4} required disabled={isPending} />
        </label>
        <button className="button primary" disabled={isPending} style={{ marginTop: 12 }}>
          {isPending ? "Sending..." : "Send message"}
        </button>
      </form>
    </div>
  );
}
