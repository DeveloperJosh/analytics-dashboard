import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Sign In Error</h1>
      {error === 'AccessDenied' && <p>You do not have permission to access this dashboard.</p>}
      <p><Link href="/auth/signin">Go back to sign in</Link></p>
    </div>
  );
}
