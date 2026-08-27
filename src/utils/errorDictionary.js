/**
 * Client-Side Error Interceptor & Dictionary for Parivahan Express.
 * Maps technical validation errors to actionable, user-friendly civic instructions.
 */

export const ERROR_DICTIONARY = {
  ERR_STATE_REQUIRED: {
    code: 'ERR_STATE_REQUIRED',
    title: 'State Selection Required',
    message: 'Select the Indian State/UT matching your permanent address proof.',
    action: 'Select your state from the dropdown menu.'
  },
  ERR_RTO_REQUIRED: {
    code: 'ERR_RTO_REQUIRED',
    title: 'RTO Office Required',
    message: 'Choose the Regional Transport Office (RTO) closest to your residential address.',
    action: 'Pick an RTO location from the list.'
  },
  ERR_NAME_INVALID: {
    code: 'ERR_NAME_INVALID',
    title: 'Full Name Format Invalid',
    message: 'Enter 3 to 50 characters containing letters and spaces only, exactly as printed on your official ID document (Aadhaar/PAN/School Certificate).',
    action: 'Remove numbers or special characters from your full name.'
  },
  ERR_DOB_FORMAT: {
    code: 'ERR_DOB_FORMAT',
    title: 'Invalid Date of Birth',
    message: 'Date of Birth must follow DD/MM/YYYY format or a valid calendar entry.',
    action: 'Select your birth date using the date picker or format as DD/MM/YYYY.'
  },
  ERR_AGE_UNDERAGE_LL: {
    code: 'ERR_AGE_UNDERAGE_LL',
    title: 'Under Age Eligibility Threshold (LL)',
    message: 'You must be at least 16 years old for a Non-Gear Motorized 50cc Learner Licence, or 18 years old for a Light Motor Vehicle (LMV) Licence.',
    action: 'Verify your birth year in educational records.'
  },
  ERR_AGE_UNDERAGE_DL: {
    code: 'ERR_AGE_UNDERAGE_DL',
    title: 'Under Age Eligibility Threshold (DL)',
    message: 'You must be at least 18 years old to apply for a permanent Driving Licence.',
    action: 'Verify your birth year in educational records.'
  },
  ERR_MOBILE_INVALID: {
    code: 'ERR_MOBILE_INVALID',
    title: 'Invalid 10-Digit Mobile Number',
    message: 'Mobile number must be a valid 10-digit Indian mobile starting with 6, 7, 8, or 9.',
    action: 'Check your mobile number entry for missing digits or prefixes.'
  },
  ERR_DL_FORMAT: {
    code: 'ERR_DL_FORMAT',
    title: 'Licence / Application Number Format Mismatch',
    message: 'Existing DL or Application Number must start with your 2-letter state code followed by year (e.g., RJ-14-2022-0012345).',
    action: 'Search your mobile SMS inbox for sender IDs like PARIVN or AD-PARIVN for exact application number format.'
  },
  ERR_PHOTO_MISSING: {
    code: 'ERR_PHOTO_MISSING',
    title: 'Applicant Photo Required',
    message: 'Official passport photo upload is mandatory for driving licence issue.',
    action: 'Tap "Upload Photo" and use Inline Media Studio to crop and auto-compress.'
  },
  ERR_PHOTO_SIZE_EXCEEDED: {
    code: 'ERR_PHOTO_SIZE_EXCEEDED',
    title: 'Photo File Exceeds 20 KB Portal Limit',
    message: 'Government portals strictly reject photos larger than 20 KB.',
    action: 'Click "Auto Compress" in Inline Media Studio to resize under 20 KB.'
  },
  ERR_SIGNATURE_MISSING: {
    code: 'ERR_SIGNATURE_MISSING',
    title: 'Applicant Signature Required',
    message: 'Signature upload on white background is mandatory.',
    action: 'Upload a photo of your signature and tap "Enhance Contrast".'
  },
  ERR_SIGNATURE_SIZE_EXCEEDED: {
    code: 'ERR_SIGNATURE_SIZE_EXCEEDED',
    title: 'Signature Exceeds 10 KB Portal Limit',
    message: 'Government portals strictly reject signatures larger than 10 KB.',
    action: 'Use the Media Studio background cleaner to compress strictly under 10 KB.'
  },
  ERR_OFFLINE_NETWORK: {
    code: 'ERR_OFFLINE_NETWORK',
    title: 'Network Connection Offline',
    message: 'Mobile network lost. All form inputs and images are cached offline on your phone using IndexedDB.',
    action: 'Continue filling the form; data will submit automatically once reconnected.'
  },
  ERR_SERVER_TIMEOUT_500: {
    code: 'ERR_SERVER_TIMEOUT_500',
    title: 'Parivahan Sewa Server Timeout',
    message: 'The government portal server took too long to respond (HTTP 500). This is a temporary server-side issue, not a problem with your application.',
    action: 'Your data is safely cached on your device. Wait a moment and tap "Simulate Portal Submission" again.'
  },
  ERR_GATEWAY_502: {
    code: 'ERR_GATEWAY_502',
    title: 'Portal Gateway Unreachable',
    message: 'The Parivahan Sewa gateway rejected the connection (HTTP 502), likely due to high traffic on the government server.',
    action: 'No data was lost. Retry submission in a few minutes.'
  },
  ERR_VALIDATION_409: {
    code: 'ERR_VALIDATION_409',
    title: 'Server-Side Record Conflict',
    message: 'The portal reported a conflict (HTTP 409) with an existing application record for this Licence/Application Number.',
    action: 'Double-check your Licence / Application Number on Step 1, then resubmit.'
  }
};

/**
 * Maps form fields to the error codes above, so field-level UI can show only the
 * error(s) relevant to that field instead of the full checklist.
 */
export const FIELD_ERROR_MAP = {
  state: ['ERR_STATE_REQUIRED'],
  rto: ['ERR_RTO_REQUIRED'],
  fullName: ['ERR_NAME_INVALID'],
  dob: ['ERR_DOB_FORMAT', 'ERR_AGE_UNDERAGE_LL', 'ERR_AGE_UNDERAGE_DL'],
  mobile: ['ERR_MOBILE_INVALID'],
  dlNo: ['ERR_DL_FORMAT'],
  photoDataUrl: ['ERR_PHOTO_MISSING', 'ERR_PHOTO_SIZE_EXCEEDED'],
  signatureDataUrl: ['ERR_SIGNATURE_MISSING', 'ERR_SIGNATURE_SIZE_EXCEEDED']
};

/**
 * Get validation errors relevant to a single field (for inline field-level display).
 */
export function getFieldErrors(formData, fieldName) {
  const codes = FIELD_ERROR_MAP[fieldName] || [];
  return validateFormState(formData).filter(err => codes.includes(err.code));
}

/**
 * Validate form fields and return array of error objects
 */
export function validateFormState(formData) {
  const errors = [];

  // State check
  if (!formData.state) {
    errors.push(ERROR_DICTIONARY.ERR_STATE_REQUIRED);
  }

  // RTO check
  if (!formData.rto) {
    errors.push(ERROR_DICTIONARY.ERR_RTO_REQUIRED);
  }

  // Full Name check
  const nameTrimmed = (formData.fullName || '').trim();
  if (!nameTrimmed || nameTrimmed.length < 3 || nameTrimmed.length > 50 || !/^[a-zA-Z\s.]+$/.test(nameTrimmed)) {
    errors.push(ERROR_DICTIONARY.ERR_NAME_INVALID);
  }

  // Date of Birth check & age calculation
  if (!formData.dob) {
    errors.push(ERROR_DICTIONARY.ERR_DOB_FORMAT);
  } else {
    const birthDate = new Date(formData.dob);
    if (isNaN(birthDate.getTime())) {
      errors.push(ERROR_DICTIONARY.ERR_DOB_FORMAT);
    } else {
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      const appType = formData.appType || 'LL';
      if (appType === 'LL' && age < 16) {
        errors.push(ERROR_DICTIONARY.ERR_AGE_UNDERAGE_LL);
      } else if (appType === 'DL' && age < 18) {
        errors.push(ERROR_DICTIONARY.ERR_AGE_UNDERAGE_DL);
      }
    }
  }

  // Mobile number check
  const mobileStr = (formData.mobile || '').replace(/\D/g, '');
  if (!/^[6-9]\d{9}$/.test(mobileStr)) {
    errors.push(ERROR_DICTIONARY.ERR_MOBILE_INVALID);
  }

  // Optional DL / App No validation if provided
  if (formData.dlNo && formData.dlNo.trim().length > 0) {
    const dlClean = formData.dlNo.trim();
    // Indian DL pattern example: RJ14 20220012345 or RJ-14-2022-0012345
    if (dlClean.length < 10) {
      errors.push(ERROR_DICTIONARY.ERR_DL_FORMAT);
    }
  }

  // Photo check
  if (!formData.photoDataUrl) {
    errors.push(ERROR_DICTIONARY.ERR_PHOTO_MISSING);
  } else if (formData.photoSizeKb && formData.photoSizeKb > 20) {
    errors.push(ERROR_DICTIONARY.ERR_PHOTO_SIZE_EXCEEDED);
  }

  // Signature check
  if (!formData.signatureDataUrl) {
    errors.push(ERROR_DICTIONARY.ERR_SIGNATURE_MISSING);
  } else if (formData.signatureSizeKb && formData.signatureSizeKb > 10) {
    errors.push(ERROR_DICTIONARY.ERR_SIGNATURE_SIZE_EXCEEDED);
  }

  return errors;
}

/**
 * Calculate readiness score (0 - 100%)
 */
export function calculateReadinessScore(formData) {
  let score = 0;
  const breakdown = {
    personalDetails: { max: 40, current: 0, label: 'Identity & Address Details' },
    formatValidations: { max: 20, current: 0, label: 'Field Formats & Age Criteria' },
    photoCompliance: { max: 20, current: 0, label: 'Photo Size (≤20 KB) & Aspect Ratio' },
    signatureCompliance: { max: 20, current: 0, label: 'Signature Contrast & Size (≤10 KB)' }
  };

  // 1. Personal Details (40%)
  let personalFilled = 0;
  if (formData.state) personalFilled += 10;
  if (formData.rto) personalFilled += 10;
  if (formData.fullName && formData.fullName.trim().length >= 3) personalFilled += 10;
  if (formData.mobile && formData.mobile.trim().length === 10) personalFilled += 10;
  breakdown.personalDetails.current = personalFilled;

  // 2. Format Validations (20%)
  let formatScore = 0;
  if (formData.dob) {
    const birthDate = new Date(formData.dob);
    if (!isNaN(birthDate.getTime())) {
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      if (age >= 16) formatScore += 10;
    }
  }
  if (formData.mobile && /^[6-9]\d{9}$/.test(formData.mobile)) {
    formatScore += 10;
  }
  breakdown.formatValidations.current = formatScore;

  // 3. Photo Compliance (20%)
  if (formData.photoDataUrl) {
    if (formData.photoSizeKb && formData.photoSizeKb <= 20) {
      breakdown.photoCompliance.current = 20;
    } else {
      breakdown.photoCompliance.current = 10; // Partial score if uploaded but uncompressed
    }
  }

  // 4. Signature Compliance (20%)
  if (formData.signatureDataUrl) {
    if (formData.signatureSizeKb && formData.signatureSizeKb <= 10) {
      breakdown.signatureCompliance.current = 20;
    } else {
      breakdown.signatureCompliance.current = 10; // Partial score
    }
  }

  score = breakdown.personalDetails.current + breakdown.formatValidations.current + breakdown.photoCompliance.current + breakdown.signatureCompliance.current;
  return { score, breakdown };
}
