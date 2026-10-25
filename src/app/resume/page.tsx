import type { Metadata } from 'next';
import ResumeView from './ResumeView';

export const metadata: Metadata = {
  title: 'Résumé',
  description: 'Résumé of Surya Mathivanan — AI Engineer at UK Textiles, builder of the Zyraa HRMS. View online, print or download the PDF.',
  alternates: { canonical: '/resume/' }
};

export default function ResumePage() {
  return <ResumeView />;
}
