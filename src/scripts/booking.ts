const form = document.querySelector<HTMLFormElement>('[data-booking-form]');
if (form) {
  const room = form.querySelector<HTMLSelectElement>('#booking-room')!;
  const checkin = form.querySelector<HTMLInputElement>('#booking-checkin')!;
  const checkout = form.querySelector<HTMLInputElement>('#booking-checkout')!;
  const guests = form.querySelector<HTMLInputElement>('#booking-guests')!;
  const name = form.querySelector<HTMLInputElement>('#booking-name')!;
  const phone = form.querySelector<HTMLInputElement>('#booking-phone')!;
  const email = form.querySelector<HTMLInputElement>('#booking-email')!;
  const notes = form.querySelector<HTMLTextAreaElement>('#booking-notes')!;
  const preview = document.querySelector<HTMLElement>('[data-booking-preview]')!;
  const message = document.querySelector<HTMLTextAreaElement>('[data-booking-message]')!;
  const whatsapp = document.querySelector<HTMLAnchorElement>('[data-whatsapp-link]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-booking-submit]')!;
  const guestNote = form.querySelector<HTMLElement>('[data-guest-note]')!;
  const selected = new URLSearchParams(window.location.search).get('room');
  if (selected && Array.from(room.options).some((option) => option.value === selected)) room.value = selected;

  // Date calculations use the hotel timezone, not UTC or the guest's local day.
  const hotelToday = () => {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Lagos', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    const value = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
    return `${value('year')}-${value('month')}-${value('day')}`;
  };
  const nextDay = (date: string) => {
    const d = new Date(`${date}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString().slice(0, 10);
  };
  const displayDate = (date: string) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
  const updateDates = () => {
    checkin.min = hotelToday();
    const start = checkin.value && checkin.value >= checkin.min ? checkin.value : checkin.min;
    checkout.min = nextDay(start);
  };
  const updateCapacity = () => {
    const capacity = Number(room.selectedOptions[0]?.dataset.capacity);
    guests.max = Number.isInteger(capacity) && capacity > 0 ? String(capacity) : '100';
    guestNote.textContent = capacity > 0 ? `Maximum ${capacity} guests for this room.` : 'Reception will confirm suitable occupancy.';
  };
  const validate = () => {
    updateDates();
    updateCapacity();
    name.setCustomValidity(name.value.trim().length >= 2 ? '' : 'Enter your full name.');
    const digits = phone.value.replace(/\D/g, '');
    phone.setCustomValidity(/^\+?[\d\s().-]+$/.test(phone.value.trim()) && digits.length >= 7 && digits.length <= 15 ? '' : 'Enter a valid phone number with 7 to 15 digits.');
    checkout.setCustomValidity(checkin.value && checkout.value && checkout.value <= checkin.value ? 'Check-out must be after check-in.' : '');
  };
  const clearPreview = () => {
    if (!preview.hidden) {
      preview.hidden = true;
      message.value = '';
      whatsapp.removeAttribute('href');
      document.dispatchEvent(new Event('marlin:layout-change'));
    }
  };
  updateDates();
  updateCapacity();
  form.addEventListener('input', () => { validate(); clearPreview(); });
  form.addEventListener('change', () => { validate(); clearPreview(); });
  form.addEventListener('focusin', updateDates);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    validate();
    if (!form.reportValidity()) return;
    const nights = Math.round((Date.parse(checkout.value) - Date.parse(checkin.value)) / 86400000);
    const selectedLabel = room.selectedOptions[0]?.dataset.label || 'Any suitable room';
    const lines = [
      'Hello Marlin Hotel & Suites, I would like to enquire about a stay.', '',
      `Preferred room category: ${selectedLabel}`,
      `Check-in: ${displayDate(checkin.value)}`,
      `Check-out: ${displayDate(checkout.value)}`,
      `Nights: ${nights}`,
      `Guests: ${guests.value}`,
      `Name: ${name.value.trim()}`,
      `Phone: ${phone.value.trim()}`,
      ...(email.value.trim() ? [`Email: ${email.value.trim()}`] : []),
      ...(notes.value.trim() ? [`Special requests: ${notes.value.trim()}`] : []), '',
      'Please confirm the current rate and availability for my preferred room. Thank you.',
    ];
    message.value = lines.join('\n');
    const recipient = form.dataset.whatsapp ?? '';
    whatsapp.href = `https://wa.me/${recipient}?text=${encodeURIComponent(message.value)}`;
    preview.hidden = false;
    document.dispatchEvent(new Event('marlin:layout-change'));
    preview.querySelector<HTMLElement>('h3')?.focus();
  });
  submit.disabled = false;
}
