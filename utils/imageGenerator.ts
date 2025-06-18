/**
 * Generates a placeholder image URL for a vehicle based on its details
 */
export const generateVehicleImage = async (
  make: string,
  model: string,
  color: string
): Promise<string> => {
  // Convert color to a hex code if it's a named color
  const colorMap: Record<string, string> = {
    red: 'FF0000',
    blue: '0000FF',
    green: '00FF00',
    black: '000000',
    white: 'FFFFFF',
    silver: 'C0C0C0',
    gray: '808080',
    yellow: 'FFFF00',
    orange: 'FFA500',
    purple: '800080',
    brown: 'A52A2A',
  };

  const colorCode = colorMap[color.toLowerCase()] || color;
  
  // Create a placeholder image URL with the vehicle details
  const width = 800;
  const height = 450;
  const text = `${make} ${model}`;
  
  // Using placeholder.com for generating placeholder images
  return `https://via.placeholder.com/${width}x${height}/${colorCode}/FFFFFF?text=${encodeURIComponent(text)}`;
};

/**
 * Format a date string to a more readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Calculate days remaining until a date
 */
export const getDaysRemaining = (dateString: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Get a status color based on days remaining
 */
export const getStatusColor = (daysRemaining: number): string => {
  if (daysRemaining < 0) return '#e74c3c'; // Overdue - red
  if (daysRemaining < 15) return '#f39c12'; // Soon - orange
  if (daysRemaining < 30) return '#3498db'; // Upcoming - blue
  return '#2ecc71'; // Good - green
};