/**
 * Export Engine for Parivahan Express.
 * Handles generating downloadable draft summary receipts and JSON application payloads.
 */

export function downloadApplicationReceipt(formData, readinessScore) {
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const payload = {
    portalName: 'Parivahan Express',
    receiptVersion: '1.0.0-CIVIC',
    generatedAt: dateStr,
    readinessScore: `${readinessScore}%`,
    applicationSummary: {
      state: formData.state || 'N/A',
      rto: formData.rto || 'N/A',
      applicationType: formData.appType === 'DL' ? 'Driving Licence (DL)' : 'Learner Licence (LL)',
      fullName: formData.fullName || 'N/A',
      dateOfBirth: formData.dob || 'N/A',
      mobileNumber: formData.mobile || 'N/A',
      existingLicenceNo: formData.dlNo || 'N/A (New Applicant)'
    },
    documentStatus: {
      photoProcessed: !!formData.photoDataUrl,
      photoSizeKb: formData.photoSizeKb ? `${formData.photoSizeKb} KB` : 'Missing',
      signatureProcessed: !!formData.signatureDataUrl,
      signatureSizeKb: formData.signatureSizeKb ? `${formData.signatureSizeKb} KB` : 'Missing'
    }
  };

  const jsonContent = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `Parivahan_Express_Receipt_${(formData.fullName || 'Draft').replace(/\s+/g, '_')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
