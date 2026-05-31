import { useContext } from 'react';
import { InterviewContext } from '../context/InterviewContext';
import {
  generateInterviewReport,
  getAllInterviewReports,
  getInterviewReportById,
  generateResumePdf,
} from '../services/interview.api';

export function useInterview() {
  const ctx = useContext(InterviewContext);
  if (!ctx) throw new Error('useInterview must be used within InterviewProvider');

  const { loading, setLoading, report, setReport, reports, setReports } = ctx;

  const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    setLoading(true);
    try {
      const data = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
      setReport(data.interviewReport);
      return data.interviewReport;
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (interviewId) => {
    setLoading(true);
    try {
      const data = await getInterviewReportById(interviewId);
      setReport(data.interviewReport);
      return data.interviewReport;
    } finally {
      setLoading(false);
    }
  };

  const getReports = async () => {
    setLoading(true);
    try {
      const data = await getAllInterviewReports();
      setReports(data.interviewReports || []);
      return data.interviewReports;
    } finally {
      setLoading(false);
    }
  };

  const getResumePdf = async (interviewReportId) => {
    try {
      const blob = await generateResumePdf({ interviewReportId });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume_${interviewReportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download failed:', err);
      throw err;
    }
  };

  return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf };
}
