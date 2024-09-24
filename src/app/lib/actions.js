"use server";
import { signIn } from '../../../auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState,
  formData,
) {
  // Ensure formData is defined and has the expected fields
  if (!formData || !formData.get('email') || !formData.get('password')) {
    throw new Error('Missing form data.');
  }

  try {
    await signIn('credentials', {
      redirect: true,
      redirectTo: '/ui/dashboard',
      email: formData.get('email'),
      password: formData.get('password'),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
