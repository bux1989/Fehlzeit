// src/FehlzeitenPageWrapper.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';

// Your existing component:
const FehlzeitenPageWrapper: React.FC<any> = (props) => {
  return <div style={{ padding: 8 }}>Fehlzeiten React Wrapper</div>;
};
export default FehlzeitenPageWrapper;

// NEW: self-mount API that returns an unmount function
export function mount(el: HTMLElement, props: any) {
  const root = createRoot(el);
  root.render(React.createElement(FehlzeitenPageWrapper, props));
  return () => root.unmount();
}
