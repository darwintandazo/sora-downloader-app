import { Header } from './components/Header';
import { VideoDownloader } from './components/VideoDownloader';
import { Footer } from './components/Footer';
import { HowItWorks } from './components/HowItWorks';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white font-sans">
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        <Header />
        <div className="w-full max-w-3xl mx-auto mt-8 md:mt-12">
          <VideoDownloader />
        </div>
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default App;
