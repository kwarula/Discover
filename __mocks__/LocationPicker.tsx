import React from 'react';

export const LocationPicker = ({ value, onChange }) => {
  return (
    <div data-testid="location-picker-mock">
      <input 
        placeholder="Enter business location or pick on map"
        value={value?.address || ''}
        onChange={(e) => onChange({ address: e.target.value, coordinates: value?.coordinates })}
      />
      <button>Pick Location on Map</button>
    </div>
  );
};