import React from 'react';
import type { Lead } from '../../types.ts';
import { DocumentArrowDownIcon } from '../Icons.tsx';

interface LeadDownloaderProps {
    leads: Lead[];
}

const LeadDownloader: React.FC<LeadDownloaderProps> = ({ leads }) => {

    const downloadFile = (content: string, fileName: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadCSV = () => {
        const headers = 'id,name,company,email,linkedin,status,priority\n';
        const rows = leads.map(l => `${l.id},"${l.name}","${l.company}",${l.email},${l.linkedin},${l.status},${l.priority}`).join('\n');
        downloadFile(headers + rows, 'leads.csv', 'text/csv');
    };

    const handleDownloadJSON = () => {
        const jsonContent = JSON.stringify(leads, null, 2);
        downloadFile(jsonContent, 'leads.json', 'application/json');
    };
    
    const handleDownloadXML = () => {
        let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<leads>\n';
        leads.forEach(l => {
            xmlContent += '  <lead>\n';
            xmlContent += `    <id>${l.id}</id>\n`;
            xmlContent += `    <name>${l.name}</name>\n`;
            xmlContent += `    <company>${l.company}</company>\n`;
            xmlContent += `    <email>${l.email}</email>\n`;
            xmlContent += `    <linkedin>${l.linkedin}</linkedin>\n`;
            xmlContent += `    <status>${l.status}</status>\n`;
            xmlContent += `    <priority>${l.priority}</priority>\n`;
            xmlContent += '  </lead>\n';
        });
        xmlContent += '</leads>';
        downloadFile(xmlContent, 'leads.xml', 'application/xml');
    };


    return (
        <div className="bg-gray-800/50 p-4 rounded-xl border border-purple-500/30">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <DocumentArrowDownIcon className="w-6 h-6" />
                ETL-Ready Leads
            </h2>
            <p className="text-xs text-slate-400 mb-4">Download leads for your Big Data pipeline.</p>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                <button onClick={handleDownloadCSV} className="flex-1 bg-blue-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-blue-700 text-sm">Download .CSV</button>
                <button onClick={handleDownloadJSON} className="flex-1 bg-green-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-green-700 text-sm">Download .JSON</button>
                <button onClick={handleDownloadXML} className="flex-1 bg-yellow-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-yellow-700 text-sm">Download .XML</button>
            </div>
        </div>
    );
};

export default LeadDownloader;