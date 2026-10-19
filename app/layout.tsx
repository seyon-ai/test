import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'ClinicFlow AI | Stellar Dental Demo Workspace',description:'Demonstration workspace for Stellar Dental enquiries, appointments and follow-up automation. Synthetic data only.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
