import Footer from '@/components/Footer/Footer';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      {children}
      <Footer />
    </section>
  );
}
