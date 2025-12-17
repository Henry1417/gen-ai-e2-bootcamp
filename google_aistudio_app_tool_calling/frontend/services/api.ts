import { Department, ValidationResult, ReportEntry } from '../types';

const API_URL = 'http://localhost:8000';

export const fetchReports = async (date?: string): Promise<ReportEntry[]> => {
    const url = date ? `${API_URL}/reports?date=${date}` : `${API_URL}/reports`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch reports');
    }
    return response.json();
};

export const uploadReportFile = async (
    file: File,
    department: Department,
    reportName: string,
    expectedDate: string
): Promise<ValidationResult> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('department', department);
    formData.append('reportName', reportName);
    formData.append('expectedDate', expectedDate);

    const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Upload failed');
    }

    const data = await response.json();
    return data;
};

export const chatWithBot = async (message: string): Promise<string> => {
    const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
    });

    if (!response.ok) {
        throw new Error('Chat failed');
    }

    const data = await response.json();
    return data.text;
};
