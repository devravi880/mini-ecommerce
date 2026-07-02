function StatCard({ label, value, color = 'bg-primary' }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${color === 'bg-primary' ? 'text-primary' : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  );
}

export default StatCard;
