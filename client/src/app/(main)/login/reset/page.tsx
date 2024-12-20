import ResetPassword from '@/components/ResetPassword/ResetPassword';

export default function Reset() {
  return <ResetPassword isEmail link="/login/reset/temporary-password" />;
}
