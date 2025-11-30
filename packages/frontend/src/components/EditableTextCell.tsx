import React, { useState } from 'react';

interface Props {
    value: string;
    onChange: (value: string) => void;
}

const EditableTextCell: React.FC<Props> = React.memo(({ value, onChange }) => {
    const [inner, setInner] = useState(value);

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
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.currentTarget.blur();
                }
            }}
            style={{ width: '100%' }}
        />
    );
});

export default React.memo(EditableTextCell);
