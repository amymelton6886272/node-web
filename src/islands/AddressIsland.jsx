import { LanguageProvider } from '../LanguageContext.jsx';
import AddressGenerator from '../react-pages/AddressGenerator.jsx';

export default function AddressIsland() {
  return <LanguageProvider><AddressGenerator /></LanguageProvider>;
}
