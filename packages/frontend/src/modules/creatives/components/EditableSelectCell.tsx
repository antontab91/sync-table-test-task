// packages/frontend/src/modules/creatives/components/EditableSelectCell.tsx
import React from 'react';

interface Option {
    value: string;
    label: string;
}

interface Props {
    value: string;
    options: Option[];
    onChange: (value: string) => void;
}

const EditableSelectCell: React.FC<Props> = ({ value, options, onChange }) => {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: '100%' }}
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
};

export default EditableSelectCell;
