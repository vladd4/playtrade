import EditPage from "@/all-pages/EditPage/EditPage";

export default function EditProductPage({ searchParams }: any) {
  const id = searchParams.id;
  return <EditPage productId={id} />;
}
