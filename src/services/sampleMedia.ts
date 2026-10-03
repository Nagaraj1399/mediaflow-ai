import sneakerImg from '../assets/images/demo_running_sneaker_1790960293811.jpg';
import watchImg from '../assets/images/demo_smart_watch_1790960309640.jpg';
import skincareImg from '../assets/images/demo_skincare_bottle_1790960323733.jpg';
import lampImg from '../assets/images/demo_desk_lamp_1790960335030.jpg';

export interface SampleMediaItem {
  id: string;
  name: string;
  category: string;
  tagline: string;
  url: string;
  localPath: string;
  resourceType?: 'image' | 'video';
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
    url: sneakerImg,
    localPath: '/assets/images/demo_running_sneaker_1790960293811.jpg',
    resourceType: 'image',
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
    url: watchImg,
    localPath: '/assets/images/demo_smart_watch_1790960309640.jpg',
    resourceType: 'image',
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
    url: skincareImg,
    localPath: '/assets/images/demo_skincare_bottle_1790960323733.jpg',
    resourceType: 'image',
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
    url: lampImg,
    localPath: '/assets/images/demo_desk_lamp_1790960335030.jpg',
    resourceType: 'image',
    width: 2048,
    height: 2048,
    bytes: 3600000,
    format: 'JPG',
    description: 'Scandinavian minimalist architectural lamp on warm oak surface with ambient shadows.',
    suggestedPrompt: 'Auto-detect lamp glow gradient, generate website hero showcase and responsive mobile card.',
  },
  {
    id: 'sample-video',
    name: 'product_motion_commercial.mp4',
    category: 'Motion & Video Showcase',
    tagline: '1080p commercial studio product reel with dynamic motion',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    localPath: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    resourceType: 'video',
    width: 1920,
    height: 1080,
    bytes: 15200000,
    format: 'MP4',
    description: 'Commercial video reel with active camera movement and high-fidelity lighting.',
    suggestedPrompt: 'Generate vertical 9:16 mobile story reel, 1:1 square feed video, and high-performance web hero.',
  },
];
