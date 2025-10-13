import React from 'react';
import { HeroImage, OptimizedImage } from './OptimizedImage';

/**
 * Test component to verify the optimized image implementation
 * This can be temporarily added to any screen to test the functionality
 */
export function TestOptimizedImage() {
  const testImageUrl = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop';

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Optimized Image Test</h2>
      
      {/* Test HeroImage component */}
      <div className="h-64 relative rounded-lg overflow-hidden">
        <h3 className="text-lg font-semibold mb-2">HeroImage with Background Color Extraction:</h3>
        <HeroImage
          src={testImageUrl}
          alt="Test Hero Image"
        />
        <div className="absolute bottom-4 left-4 bg-white/90 p-2 rounded">
          <p className="text-sm font-medium">Hero Image Test</p>
        </div>
      </div>

      {/* Test regular OptimizedImage */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Regular OptimizedImage:</h3>
        <div className="w-48 h-48">
          <OptimizedImage
            src={testImageUrl}
            alt="Test Optimized Image"
            className="w-full h-full rounded-lg"
            fill={true}
            extractColor={true}
          />
        </div>
      </div>

      {/* Test with invalid image */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Fallback Test (Invalid URL):</h3>
        <div className="w-48 h-48">
          <OptimizedImage
            src="https://invalid-url.com/image.jpg"
            alt="Invalid Image Test"
            className="w-full h-full rounded-lg"
            fallbackClassName="w-full h-full rounded-lg"
            fill={true}
          />
        </div>
      </div>
    </div>
  );
}
