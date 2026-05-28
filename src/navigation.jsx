import { ClipboardList, FileCode2, Gift, Image, Library, MapPin, Scale, Search, ShieldCheck, Users, Wifi, BookOpen } from 'lucide-react';
import { featureModules } from './featureModules.js';

const icons = {
  users: Users,
  scale: Scale,
  gift: Gift,
  search: Search,
  image: Image,
  fileCode: FileCode2,
  wifi: Wifi,
  mapPin: MapPin,
  bookOpen: BookOpen,
  clipboardList: ClipboardList,
  shieldCheck: ShieldCheck,
  library: Library,
};

export const features = featureModules
  .filter((feature) => feature.enabled !== false)
  .map((feature) => ({
    ...feature,
    Icon: icons[feature.icon] || FileCode2,
  }));

export const enabledFeatureIds = new Set(features.map((feature) => feature.id));
