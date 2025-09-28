/**
 * 404 Not Found Page Component
 * 
 * A user-friendly error page displayed when users navigate to routes that don't exist
 * in the Smart Student Hub application. This component provides clear feedback about
 * the missing page and maintains the application's visual consistency.
 * 
 * Features:
 * - Clear error messaging with visual indicators
 * - Consistent styling with the overall application theme
 * - Professional presentation suitable for academic environments
 * - Helpful developer guidance for debugging routing issues
 * 
 * Design Characteristics:
 * - Centered layout for focused attention
 * - Card-based design matching application aesthetics
 * - Alert icon for visual error indication
 * - Responsive design for various screen sizes
 * 
 * Usage:
 * This component is automatically rendered by the routing system when:
 * - Users navigate to undefined routes
 * - Broken links are accessed
 * - Bookmarked pages no longer exist
 * - Development routing configuration issues occur
 * 
 * Development Notes:
 * - Includes helpful message for developers about router configuration
 * - Can be enhanced with navigation options if needed
 * - Maintains consistent error handling patterns
 */

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

/**
 * Not Found Component
 * 
 * Renders a professional 404 error page with clear messaging and consistent styling.
 * 
 * @returns {JSX.Element} 404 error page with card layout and helpful messaging
 */
export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
