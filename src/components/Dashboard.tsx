import { useUserStore } from '@/stores/userStore';

export default function Dashboard() {
  const netWorth = useUserStore((s) => s.netWorth);
  return (
    <div style={{ position: 'absolute', top: 24, left: 24, background: 'rgba(255,255,255,0.9)', borderRadius: 12, padding: '1.5rem 2rem', boxShadow: '0 2px 16px #0001', fontSize: 24, fontWeight: 600 }}>
      Net Worth: ${netWorth.toLocaleString()}
    </div>
  );
}
