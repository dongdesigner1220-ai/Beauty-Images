import React from 'react';
import { Zap, Heart, Shield, CheckCircle } from 'lucide-react';

export const FeatureSection: React.FC = () => {
  const features = [
    {
      name: 'Smart AI Sharpening',
      description: 'Advanced algorithms that detect and enhance details without introducing noise or halos.',
      icon: Zap,
    },
    {
      name: 'Skin-Tone Aware',
      description: 'Intelligent beauty retouching that respects natural skin tones. No over-whitening or plastic skin.',
      icon: Heart,
    },
    {
      name: 'Secure Processing',
      description: 'Your images are processed securely and deleted automatically. We value your privacy.',
      icon: Shield,
    },
    {
      name: 'No Fake Texture',
      description: 'Unlike other tools, we preserve original textures like pores and fabrics for a realistic look.',
      icon: CheckCircle,
    },
  ];

  return (
    <div id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Why Choose Lumina AI?
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Experience the next generation of image enhancement technology.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="relative p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 bg-blue-50 rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
             <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Beauty Retouch – Respect Natural Skin Tone</h3>
             <p className="text-gray-600 mb-6 leading-relaxed">
               Our AI removes acne and skin imperfections intelligently. For dark or brown skin tones, the system cleans acne without changing skin color. For fair skin tones, the AI gently smooths skin and adds a soft pinkish-white glow — always natural, never overdone.
             </p>
             <p className="font-medium text-blue-700">Perfect for beauty clinics, photographers, and professional designers.</p>
          </div>
          <div className="lg:w-1/2">
            <img 
               src="https://picsum.photos/800/600?random=1" 
               alt="Skin retouch example" 
               className="rounded-xl shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};