// packages/frontend/src/modules/creatives/components/EditableTextCell.tsx
import React, { useState, useEffect } from 'react';

interface Props {
    value: string;
    onChange: (value: string) => void;
}

const EditableTextCell: React.FC<Props> = React.memo(({ value, onChange }) => {
    const [inner, setInner] = useState(value);

    useEffect(() => {
        setInner(value);
    }, [value]);

    const handleBlur = () => {
        if (inner !== value) {
            onChange(inner);
        }
    };

    return (
        <input
            type="text"
            value={inner}
            onChange={(e) => setInner(e.target.value)}
            onBlur={handleBlur}
            style={{ width: '100%' }}
        />
    );
});

export default EditableTextCell;
