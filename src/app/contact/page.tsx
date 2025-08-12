export default function Contact() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Contact</h1>
      <form className="flex flex-col max-w-md space-y-2">
        <input type="text" name="name" placeholder="Name" className="border p-2" />
        <input type="email" name="email" placeholder="Email" className="border p-2" />
        <textarea name="message" placeholder="Message" className="border p-2" rows={4} />
        <button type="submit" className="bg-blue-500 text-white p-2">Send</button>
      </form>
    </main>
  );
}
