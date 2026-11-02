import api from './api.js'

export const resumesApi = {
  async analyze(file, jobDescription = '') {
    const form = new FormData()
    form.append('resume', file)
    if (jobDescription.trim()) form.append('jobDescription', jobDescription.trim())
    const response = await api.post('/resumes/ats', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    return response.data.data
  },
  async listAnalyses() {
    const response = await api.get('/resumes/analyses')
    return response.data.data || []
  },
}
