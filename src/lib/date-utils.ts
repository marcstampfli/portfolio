/**
 * Calculates the duration between two dates and returns a formatted string
 * @param startDate - The start date
 * @param endDate - The end date (null for current position)
 * @returns Formatted duration string like "2 yrs 3 mos" or "3 mos"
 */
export function calculateDuration(startDate: string | Date, endDate: string | Date | null): string {
  try {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    // Validate dates
    if (isNaN(start.getTime()) || (endDate && isNaN(end.getTime()))) {
      return "Duration unavailable";
    }
    
    const diffTime = end.getTime() - start.getTime();
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Average month length
    
    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;
    
    const parts: string[] = [];
    
    if (years > 0) {
      parts.push(`${years} yr${years !== 1 ? 's' : ''}`);
    }
    
    if (months > 0) {
      parts.push(`${months} mo${months !== 1 ? 's' : ''}`);
    }
    
    if (parts.length === 0) {
      return "Less than 1 mo";
    }
    
    return parts.join(' ');
  } catch (error) {
    console.error('Error calculating duration:', error);
    return "Duration unavailable";
  }
}

/**
 * Formats a date range string
 * @param startDate - The start date
 * @param endDate - The end date (null for current position)
 * @returns Formatted date range like "Aug 2021 - Present" or "Apr 2021 - Nov 2021"
 */
export function formatDateRange(startDate: string | Date, endDate: string | Date | null): string {
  try {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    // Validate dates
    if (isNaN(start.getTime()) || (endDate && end && isNaN(end.getTime()))) {
      return "Date range unavailable";
    }
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      });
    };
    
    const startFormatted = formatDate(start);
    const endFormatted = end ? formatDate(end) : 'Present';
    
    return `${startFormatted} - ${endFormatted}`;
  } catch (error) {
    console.error('Error formatting date range:', error);
    return "Date range unavailable";
  }
}

/**
 * Generates a complete period string with duration
 * @param startDate - The start date
 * @param endDate - The end date (null for current position)
 * @returns Complete period string like "Aug 2021 - Present · 3 yrs 6 mos"
 */
export function generatePeriodString(startDate: string | Date, endDate: string | Date | null): string {
  const dateRange = formatDateRange(startDate, endDate);
  const duration = calculateDuration(startDate, endDate);
  
  return `${dateRange} · ${duration}`;
}
