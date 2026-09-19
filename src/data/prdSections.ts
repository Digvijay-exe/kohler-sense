import { PrdSection } from '../types';
import { prdSectionsPart1 } from './prdSectionsPart1';
import { prdSectionsPart2 } from './prdSectionsPart2';
import { prdSectionsPart3 } from './prdSectionsPart3';

export const allPrdSections: PrdSection[] = [
  ...prdSectionsPart1,
  ...prdSectionsPart2,
  ...prdSectionsPart3,
];

export const prdCategories = [
  'All Sections',
  'Strategy & Overview',
  'Architecture & Tech',
  'AI & ML Intelligence',
  'IoT & Data Processing',
  'Operations & Dispatch',
  'Validation & Governance',
] as const;
