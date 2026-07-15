/**
 * LoadingSpinner.jsx — Animated loading indicator
 *
 * Displays a spinning icon with optional text.
 * Used during auth initialization and content loading.
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <Loader2 className="loading-spinner__icon" />
  </div>
);

export default LoadingSpinner;
