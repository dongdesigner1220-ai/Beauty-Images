import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip 
} from 'recharts';
import { Download } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ImageUploader } from './components/ImageUploader';
import { ControlPanel } from './components/ControlPanel';
import { ComparisonSlider } from './components/ComparisonSlider';
import { Button } from './components/Button';
import { FeatureSection } from './components/FeatureSection';
import { EnhancementMode, UpscaleLevel, ProcessedImage } from './types';
import { enhanceImage } from './services/gemini';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  
  const [mode, setMode] = useState<EnhancementMode>(EnhancementMode.RETOUCH);
  const [upscale, setUpscale] = useState<UpscaleLevel>(UpscaleLevel.OG);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setOriginalPreview(url);
    setProcessedImage(null); // Reset result
    setError(null);
  };

  const handleRemoveImage = () => {
    setFile(null);
    setOriginalPreview(null);
    setProcessedImage(null);
    setError(null);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleEnhance = async () => {
    if (!file || !originalPreview) return;
    
    setLoading(true);
    setError(null);
    const startTime = Date.now();

    try {
      const base64 = await fileToBase64(file);
      const enhancedUrl = await enhanceImage(base64, mode, upscale);

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      // Mock metrics for the visualization chart
      // In a real app, these would come from analysis
      const metrics = [
        {
          subject: 'Sharpness',
          A: 50,
          B: 90,
          fullMark: 100,
        },
        {
          subject: 'Color',
          A: 60,
          B: 85,
          fullMark: 100,
        },
        {
          subject: 'Texture',
          A: 40,
          B: 88,
          fullMark: 100,
        },
        {
          subject: 'Noise',
          A: 30, // High noise
          B: 95, // Low noise (score higher is better quality)
          fullMark: 100,
        },
        {
          subject: 'Detail',
          A: 45,
          B: 92,
          fullMark: 100,
        },
      ];

      setProcessedImage({
        originalUrl: originalPreview,
        enhancedUrl: enhancedUrl,
        stats: {
          originalSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          enhancedSize: `~${(file.size / 1024 / 1024 * 1.1).toFixed(2)} MB`, // Estimate
          processingTime: duration,
        },
        metrics: metrics as any
      });
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to enhance image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage.enhancedUrl;
      link.download = `lumina_enhanced_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-100 pb-16 pt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Enhance & Retouch Images with <span className="text-blue-600">AI Precision</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-500">
              Sharpen, retouch and upscale images up to 8× using smart AI technology. 
              Designed for portraits, beauty, products and landscapes.
            </p>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {error && (
               <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
               </div>
            )}

            {!processedImage ? (
              // Tool Mode
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Uploader */}
                <div className="lg:col-span-8 order-2 lg:order-1">
                  <ImageUploader 
                    currentImage={originalPreview} 
                    onImageSelect={handleImageSelect}
                    onRemove={handleRemoveImage}
                  />
                </div>

                {/* Right: Controls */}
                <div className="lg:col-span-4 order-1 lg:order-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-fit sticky top-24">
                  <ControlPanel 
                    mode={mode} 
                    setMode={setMode} 
                    upscale={upscale} 
                    setUpscale={setUpscale}
                    disabled={loading || !file}
                  />
                  
                  <div className="mt-8">
                    <Button 
                      onClick={handleEnhance} 
                      disabled={!file} 
                      loading={loading}
                      size="lg"
                      className="w-full"
                    >
                      ENHANCE IMAGE
                    </Button>
                    <p className="text-xs text-gray-400 text-center mt-3">
                      Processing may take 5-10 seconds depending on complexity.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Result Mode
              <div className="space-y-12 animate-fade-in">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Slider Section */}
                    <div className="lg:col-span-8 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
                       <ComparisonSlider 
                          beforeImage={processedImage.originalUrl} 
                          afterImage={processedImage.enhancedUrl} 
                       />
                       
                       <div className="flex justify-center mt-6 space-x-4">
                         <Button onClick={handleDownload} size="lg" className="flex items-center space-x-2">
                           <Download size={20} />
                           <span>Download Image</span>
                         </Button>
                         <Button variant="outline" size="lg" onClick={() => {
                           setProcessedImage(null);
                           setFile(null);
                           setOriginalPreview(null);
                         }}>
                           Enhance Another
                         </Button>
                       </div>
                    </div>

                    {/* Stats Section */}
                    <div className="lg:col-span-4 p-6 lg:p-8 bg-gray-50 flex flex-col justify-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Quality Analysis</h3>
                      
                      <div className="h-64 w-full mb-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={processedImage.metrics}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                            <Radar
                              name="Before"
                              dataKey="A"
                              stroke="#9ca3af"
                              fill="#9ca3af"
                              fillOpacity={0.3}
                            />
                            <Radar
                              name="After"
                              dataKey="B"
                              stroke="#2563eb"
                              fill="#2563eb"
                              fillOpacity={0.6}
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center space-x-6 text-xs mt-2">
                           <div className="flex items-center"><div className="w-3 h-3 bg-gray-400 opacity-50 rounded-full mr-2"></div> Before</div>
                           <div className="flex items-center"><div className="w-3 h-3 bg-blue-600 opacity-60 rounded-full mr-2"></div> After</div>
                        </div>
                      </div>

                      <div className="space-y-4 text-sm text-gray-600">
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span>Processing Time</span>
                          <span className="font-mono font-medium text-gray-900">{processedImage.stats.processingTime.toFixed(2)}s</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span>Original Size</span>
                          <span className="font-mono font-medium text-gray-900">{processedImage.stats.originalSize}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span>Result Size (Est)</span>
                          <span className="font-mono font-medium text-gray-900">{processedImage.stats.enhancedSize}</span>
                        </div>
                         <div className="flex justify-between pb-2">
                          <span>Resolution</span>
                          <span className="font-mono font-medium text-gray-900">{upscale === UpscaleLevel.OG ? 'Original' : `Upscaled (${upscale})`}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <FeatureSection />
        
        {/* Call to Action Bottom */}
        <div className="bg-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
              Ready to upgrade your images?
            </h2>
            <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of users enhancing their photos with Lumina AI today.
            </p>
            <button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-3 border border-transparent text-lg font-medium rounded-full text-blue-700 bg-white hover:bg-gray-50 shadow-lg transition-transform hover:-translate-y-1"
            >
              Enhance Image Now
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;