export const isCollegeStudent = (user) => {
  if (!user || !user.email) return false;
  
  // Allow admins to bypass this check so they can always manage/view content
  if (user.isAdmin) return true;

  // Regex: exactly 13 digits followed by @recsonbhadra.ac.in
  const collegeEmailRegex = /^\d{13}@recsonbhadra\.ac\.in$/i;
  
  return collegeEmailRegex.test(user.email);
};
