import ExamplesSection from "@/components/examples-section";
import Footer from "@/components/footer";
import FormWithImageUpload from "@/components/form-exemple";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col">
      <main className="flex-1 flex items-center flex-col justify-center p-8 gap-16 sm:p-20">
        <FormWithImageUpload />
        <ExamplesSection />
      </main>
      <Footer />
    </div>
  );
}
