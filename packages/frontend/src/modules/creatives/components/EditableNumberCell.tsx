// packages/frontend/src/modules/creatives/components/EditableNumberCell.tsx
import React, { useState, useEffect } from 'react';

interface Props {
    value: number;
    onChange: (value: number) => void;
}

const EditableNumberCell: React.FC<Props> = ({ value, onChange }) => {
    const [inner, setInner] = useState<string>(String(value));

    useEffect(() => {
        setInner(String(value));
    }, [value]);

    const handleBlur = () => {
        const parsed = Number(inner);
        if (!Number.isNaN(parsed) && parsed !== value) {
            onChange(parsed);
        } else {
            setInner(String(value));
        }
    };

    return (
        <input
            type="number"
            value={inner}
            onChange={(e) => setInner(e.target.value)}
            onBlur={handleBlur}
            style={{ width: '100%' }}
        />
    );
};

export default EditableNumberCell;
