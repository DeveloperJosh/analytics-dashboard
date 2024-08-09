// logout for the user and redirect to the homepage
import { signOut } from 'next-auth/react';

export default function Logout() {
    signOut();
    return null;
}