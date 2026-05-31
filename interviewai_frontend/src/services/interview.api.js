import api from './api';

export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
  const formData = new FormData();
  formData.append('jobDescription', jobDescription);
  if (selfDescription) formData.append('selfDescription', selfDescription);
  if (resumeFile instanceof File) formData.append('resume', resumeFile);
  const res = await api.post('/api/interview', formData);
  return res.data;
};

export const getAllInterviewReports = async () => {
  const res = await api.get('/api/interview');
  return res.data;
};

export const getInterviewReportById = async (interviewId) => {
  const res = await api.get(`/api/interview/report/${interviewId}`);
  return res.data;
};

export const generateResumePdf = async ({ interviewReportId }) => {
  const res = await api.post(
    `/api/interview/resume/pdf/${interviewReportId}`,
    null,
    { responseType: 'blob' }
  );
  return res.data;
};
