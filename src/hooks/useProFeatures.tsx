import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface ProFeature {
  name: string;
  trialCount: number;
  maxTrials: number;
}

export const useProFeatures = () => {
  const [proFeatures, setProFeatures] = useState<Record<string, ProFeature>>({});
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`pro_features_${user.id}`);
      if (saved) {
        setProFeatures(JSON.parse(saved));
      }
    }
  }, [user]);

  const saveFeatures = (features: Record<string, ProFeature>) => {
    if (user) {
      localStorage.setItem(`pro_features_${user.id}`, JSON.stringify(features));
      setProFeatures(features);
    }
  };

  const useFeature = (featureName: string, maxTrials: number = 2) => {
    if (!user) return false;

    const feature = proFeatures[featureName] || { name: featureName, trialCount: 0, maxTrials };
    
    if (feature.trialCount >= feature.maxTrials) {
      return false;
    }

    const updatedFeatures = {
      ...proFeatures,
      [featureName]: {
        ...feature,
        trialCount: feature.trialCount + 1
      }
    };

    saveFeatures(updatedFeatures);
    return true;
  };

  const canUseFeature = (featureName: string, maxTrials: number = 2) => {
    if (!user) return true; // Allow non-authenticated users to try
    
    const feature = proFeatures[featureName];
    return !feature || feature.trialCount < maxTrials;
  };

  const getTrialCount = (featureName: string) => {
    const feature = proFeatures[featureName];
    return feature ? feature.trialCount : 0;
  };

  return {
    useFeature,
    canUseFeature,
    getTrialCount
  };
};