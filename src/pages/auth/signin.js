import { signIn } from 'next-auth/react';

export default function SignIn() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Sign In</h1>
      <button type="button" onClick={() => signIn('discord')}>
        Sign in with Discord
      </button>
    </div>
  );
}
