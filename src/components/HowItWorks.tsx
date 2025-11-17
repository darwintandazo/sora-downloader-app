import React from 'react';
import { PasteIcon, QualityIcon, WatermarkIcon } from './IconComponents';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
    <div className="bg-gray-800/40 p-6 rounded-lg border border-gray-700/50 flex flex-col items-center text-center">
        <div className="flex-shrink-0 bg-purple-600/20 text-purple-400 rounded-full p-3">
            {icon}
        </div>
        <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm text-gray-400">{description}</p>
    </div>
);


export const HowItWorks = () => {
  return (
    <div className="w-full max-w-5xl mx-auto mt-16 md:mt-24 px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-4">Simple & Powerful</h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Just three simple steps to get your watermark-free Sora video.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
                icon={<PasteIcon className="h-8 w-8" />}
                title="1. Paste Link"
                description="Find the Sora video you want and copy its URL. Paste it into the input box above."
            />
            <FeatureCard 
                icon={<QualityIcon className="h-8 w-8" />}
                title="2. Process Video"
                description="Click the 'Download' button. Our system will process the video to prepare it in high quality."
            />
             <FeatureCard 
                icon={<WatermarkIcon className="h-8 w-8" />}
                title="3. Download"
                description="Your video is ready! Click the download button to save it to your device, without any watermarks."
            />
        </div>
    </div>
  );
};