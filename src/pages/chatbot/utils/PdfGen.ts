
import { jsPDF } from 'jspdf';
import { PatientData } from '../../../types/PatientData';

export const generatePDF = (patientData:PatientData) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('Patient Details Slip', 20, 20);

  doc.setFontSize(12);
  doc.text(`Full Name: ${patientData.FullName}`, 20, 40);
  doc.text(`Age: ${patientData.Age}`, 20, 50);
  doc.text(`Gender: ${patientData.Gender}`, 20, 60);
  doc.text(`Location: ${patientData.Location}`, 20, 70);
  doc.text(`Medical History: ${patientData.MedicalHistory.join(', ')}`, 20, 80);
  doc.text(`Symptoms: ${patientData.LikelySymptoms.join(', ')}`, 20, 90);
  doc.text(`Likely Diseases: ${patientData.LikelyDiseases.join(', ')}`, 20, 100);
  doc.text(`Severity Level: ${patientData.SeverityLevel}`, 20, 110);
  doc.text(`Urgency: ${patientData.Urgency}`, 20, 120);
  doc.text(`Recommended OPD: ${patientData.RecommendedOPD}`, 20, 130);

  doc.save(`${patientData.FullName}_Slip.pdf`);
};
