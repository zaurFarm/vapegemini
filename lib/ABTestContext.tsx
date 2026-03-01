'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ABGroup = 'A' | 'B';

interface ABTestContextType {
  group: ABGroup;
  trackEvent: (eventName: string, data?: any) => void;
}

const ABTestContext = createContext<ABTestContextType | undefined>(undefined);

export function ABTestProvider({ children }: { children: React.ReactNode }) {
  const [group, setGroup] = useState<ABGroup>('A');

  useEffect(() => {
    const init = () => {
      const savedGroup = localStorage.getItem('ab_group') as ABGroup;
      if (savedGroup) {
        setGroup(savedGroup);
      } else {
        const newGroup = Math.random() > 0.5 ? 'A' : 'B';
        localStorage.setItem('ab_group', newGroup);
        setGroup(newGroup);
      }
    };
    init();
  }, []);

  const trackEvent = (eventName: string, data?: any) => {
    console.log(`[A/B Test Event - Group ${group}]: ${eventName}`, data);
    // Здесь была бы отправка данных в аналитику (например, Mixpanel, Amplitude, Google Analytics)
  };

  return (
    <ABTestContext.Provider value={{ group, trackEvent }}>
      {children}
    </ABTestContext.Provider>
  );
}

export function useABTest() {
  const context = useContext(ABTestContext);
  if (context === undefined) {
    throw new Error('useABTest must be used within an ABTestProvider');
  }
  return context;
}
