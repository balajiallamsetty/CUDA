import { useMemo, useState } from 'react';
import { TIMELINE_OPTIONS, PA_DOMAIN_LABELS, PA_DOMAIN_VALUES } from '@vignak/shared';
import { Input, Select, Textarea } from '../ui/Field';
import Button from '../ui/Button';
import { PROJECT_CATEGORY_OPTIONS } from '../../data/projectCategories';

/**
 * Config-driven service request form.
 * @param {{ fields: Array, initialValues?: object, onSubmit: Function, submitting?: boolean, submitLabel?: string }} props
 */
export default function ServiceRequestForm({
  fields = [],
  initialValues = {},
  onSubmit,
  submitting = false,
  submitLabel = 'Submit request',
}) {
  const defaults = useMemo(() => {
    const base = {};
    for (const field of fields) {
      if (field.key === 'technologies') base[field.key] = '';
      else base[field.key] = initialValues[field.key] ?? '';
    }
    return { ...base, ...initialValues };
  }, [fields, initialValues]);

  const [form, setForm] = useState(defaults);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form };
    if (Object.prototype.hasOwnProperty.call(payload, 'technologies') && typeof payload.technologies === 'string') {
      payload.technologies = payload.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }
    const core = [
      'title',
      'description',
      'domain',
      'requirements',
      'technologies',
      'timeline',
      'expectedCompletionDate',
      'phone',
      'organization',
      'course',
      'year',
    ];
    const body = {};
    const extra = {};
    for (const [key, value] of Object.entries(payload)) {
      if (value === '' || value === undefined) continue;
      if (core.includes(key)) body[key] = value;
      else extra[key] = value;
    }
    if (Object.keys(extra).length) body.payload = extra;
    await onSubmit(body);
  }

  function renderField(field) {
    const value = form[field.key] ?? '';
    const common = {
      label: field.label,
      name: field.key,
      value,
      onChange,
      required: Boolean(field.required),
    };

    if (field.type === 'textarea') return <Textarea key={field.key} {...common} />;
    if (field.type === 'timeline') {
      return (
        <Select key={field.key} {...common}>
          <option value="">Select timeline</option>
          {TIMELINE_OPTIONS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
      );
    }
    if (field.type === 'pa_domain') {
      return (
        <Select key={field.key} {...common}>
          <option value="">Select domain</option>
          {(PROJECT_CATEGORY_OPTIONS.length ? PROJECT_CATEGORY_OPTIONS : PA_DOMAIN_VALUES.map((v) => ({
            value: v,
            label: PA_DOMAIN_LABELS[v] || v,
          }))).map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Select>
      );
    }
    if (field.type === 'tags') {
      return <Input key={field.key} {...common} hint="Comma-separated" />;
    }
    if (field.type === 'date') {
      return <Input key={field.key} type="date" {...common} />;
    }
    return <Input key={field.key} {...common} />;
  }

  return (
    <form className="grid max-w-2xl gap-4 rounded-2xl border border-line-soft bg-white p-6 shadow-soft" onSubmit={handleSubmit}>
      {fields.map(renderField)}
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Submitting…' : submitLabel}
      </Button>
    </form>
  );
}
