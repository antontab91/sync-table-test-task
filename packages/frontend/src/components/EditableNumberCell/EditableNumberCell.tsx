import React, { useState } from 'react';

interface Props {
    value: number;
    onChange: (value: number) => void;
}

const EditableNumberCell: React.FC<Props> = ({ value, onChange }) => {
    const [inner, setInner] = useState(String(value));

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
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.currentTarget.blur();
                }
            }}
            style={{ width: '100%' }}
        />
    );
};

export default React.memo(EditableNumberCell);
