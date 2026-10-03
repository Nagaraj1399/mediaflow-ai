export interface SampleMediaItem {
  id: string;
  name: string;
  category: string;
  tagline: string;
  url: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  description: string;
  suggestedPrompt: string;
}

export const SAMPLE_MEDIA_ITEMS: SampleMediaItem[] = [
  {
    id: 'sample-sneaker',
    name: 'aerodynamic_running_sneaker.jpg',
    category: 'Footwear & Athletic',
    tagline: 'High-contrast footwear on natural travertine podium',
    url: '/src/assets/images/demo_running_sneaker_1790960293811.jpg',
    width: 2048,
    height: 2048,
    bytes: 3840000,
    format: 'JPG',
    description: 'Commercial studio product shot of athletic sneaker with vivid graphite & orange tones.',
    suggestedPrompt: 'Produce square marketplace catalog, vertical Instagram Reels story, and high-performance WebP hero banner.',
  },
  {
    id: 'sample-watch',
    name: 'minimalist_smart_watch.jpg',
    category: 'Consumer Electronics & Wearables',
    tagline: 'Matte black titanium bezel on dark basalt stone',
    url: '/src/assets/images/demo_smart_watch_1790960309640.jpg',
    width: 2048,
    height: 2048,
    bytes: 4200000,
    format: 'JPG',
    description: 'Luxury tech product shot with subtle rim lighting and metallic micro-textures.',
    suggestedPrompt: 'Generate OLED pure black background story variant, 1:1 e-commerce zoom crop, and retargeting ad creative.',
  },
  {
    id: 'sample-skincare',
    name: 'amber_skincare_serum.jpg',
    category: 'Beauty & Wellness',
    tagline: 'Amber glass dropper bottle on wet reflection slate',
    url: '/src/assets/images/demo_skincare_bottle_1790960323733.jpg',
    width: 2048,
    height: 2048,
    bytes: 4600000,
    format: 'JPG',
    description: 'Clean cosmetic dropper shot with fluid dynamics and subtle water ripple reflections.',
    suggestedPrompt: 'Preserve dropper water reflection, prepare Amazon compliant square with white pad, and 4:5 social portrait.',
  },
  {
    id: 'sample-lamp',
    name: 'modern_desk_lamp.jpg',
    category: 'Interior & Architectural Design',
    tagline: 'Architectural matte finish desk lamp with warm glow',
    url: '/src/assets/images/demo_desk_lamp_1790960335030.jpg',
    width: 2048,
    height: 2048,
    bytes: 3600000,
    format: 'JPG',
    description: 'Scandinavian minimalist architectural lamp on warm oak surface with ambient shadows.',
    suggestedPrompt: 'Auto-detect lamp glow gradient, generate website hero showcase and responsive mobile card.',
  },
];
