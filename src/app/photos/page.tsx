import Image from "next/image";

const photos = [
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
  "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
];

export default function Photos() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Photography</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {photos.map((src, idx) => (
          <Image key={idx} src={src} alt={`Photo ${idx + 1}`} width={400} height={300} />
        ))}
      </div>
    </main>
  );
}
