'use dom';
import React from 'react';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';

export default function WhiteboardCanvas() {
  return (
    <div style={containerStyle}>
      <Tldraw />
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
};
