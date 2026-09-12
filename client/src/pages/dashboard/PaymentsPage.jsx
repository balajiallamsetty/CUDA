import PageMeta from '../../components/common/PageMeta';
import { EmptyState } from '../../components/ui/States';

export default function PaymentsPage() {
  return (
    <div>
      <PageMeta title="Payments" path="/dashboard/payments" />
      <p className="eyebrow">Billing</p>
      <h1 className="!text-3xl">Payments</h1>
      <div className="mt-6">
        <EmptyState
          title="Payments coming soon"
          description="Invoicing and payment tracking will be available in a later release. Contact support for payment arrangements."
        />
      </div>
    </div>
  );
}
