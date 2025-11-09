"use client";
import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';
import { CouponModal } from './CouponModal';

type ConfirmState = { ok: boolean; code?: string; error?: string };

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-4 py-3 rounded-xl bg-accent text-ink font-extrabold text-lg border-4 border-white shadow-retro hover:scale-[1.02] transition disabled:opacity-75"
    >
  {pending ? 'Gerando cupom...' : 'Vou estar lá! 🎉'}
    </button>
  );
}

export function ConfirmButton({
  action,
  eventId,
}: {
  action: (state: ConfirmState, formData: FormData) => Promise<ConfirmState>;
  eventId: string;
}) {
  const [state, formAction] = useFormState(action, { ok: false } as ConfirmState);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state?.ok && state.code) setOpen(true);
  }, [state]);

  return (
    <>
  <form action={formAction} className="flex flex-col gap-2">
        <input type="hidden" name="event_id" value={eventId} />
        <input
          required
          name="user_name"
          placeholder="Seu nome"
          className="px-3 py-2 rounded-lg border-2 border-white bg-white/90 text-ink placeholder-ink/60"
        />
        <input
          type="email"
          name="user_email"
          placeholder="Email (opcional)"
          className="px-3 py-2 rounded-lg border-2 border-white bg-white/90 text-ink placeholder-ink/60"
        />
        <input
          name="user_phone"
          placeholder="Celular (opcional)"
          className="px-3 py-2 rounded-lg border-2 border-white bg-white/90 text-ink placeholder-ink/60"
        />
        <SubmitBtn />
        {state?.error && (
          <p className="text-red-200 text-sm font-semibold mt-1">{state.error}</p>
        )}
      </form>
      <CouponModal code={open ? state.code : undefined} onClose={() => setOpen(false)} />
    </>
  );
}
