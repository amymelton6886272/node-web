import { LanguageProvider } from '../LanguageContext.jsx';
import Glossary from '../react-pages/Glossary.jsx';

export default function GlossaryIsland() {
  return <LanguageProvider><Glossary /></LanguageProvider>;
}
