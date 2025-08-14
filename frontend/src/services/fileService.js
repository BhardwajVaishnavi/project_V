import api, { createFormData, uploadWithProgress } from './api';

const fileService = {
  uploadFile: async (fileData, onProgress) => {
    const formData = createFormData(fileData);
    
    if (onProgress) {
      return await uploadWithProgress('/files/upload', formData, onProgress);
    } else {
      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }
  },

  uploadMultipleFiles: async (fileData, onProgress) => {
    const formData = createFormData(fileData, 'files');
    
    if (onProgress) {
      return await uploadWithProgress('/files/upload-multiple', formData, onProgress);
    } else {
      const response = await api.post('/files/upload-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }
  },

  getPatientFiles: async (patientId, documentType, category) => {
    const params = new URLSearchParams();
    if (documentType) params.append('documentType', documentType);
    if (category) params.append('category', category);
    
    const queryString = params.toString();
    const url = `/files/patient/${patientId}${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },

  getDownloadUrl: async (fileId) => {
    const response = await api.get(`/files/${fileId}/download`);
    return response.data;
  },

  deleteFile: async (fileId) => {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
  },

  // Helper function to validate file types
  validateFileType: (file, allowedTypes = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    return allowedTypes.includes(fileExtension);
  },

  // Helper function to validate file size
  validateFileSize: (file, maxSizeInMB = 10) => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  },

  // Helper function to format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Helper function to get file icon based on type
  getFileIcon: (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'doc':
      case 'docx':
        return 'description';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'image';
      case 'xls':
      case 'xlsx':
        return 'table_chart';
      default:
        return 'insert_drive_file';
    }
  },
};

export default fileService;
