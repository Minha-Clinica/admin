import React, { useState, useEffect } from 'react';
import { Box, Text } from '../../../atoms';

const RadioGroup = ({ name, options, value, onBlur }) => {

    if (options.length === 0) return

    const [selectedValue, setSelectedValue] = useState(value || '');

    useEffect(() => {
        setSelectedValue(value || '');
    }, [value]);

    const handleChange = (option) => {
        setSelectedValue(option);

        // Dispara a atualização somente no onBlur.
        onBlur(option);
    };

    return (
        <div>
            {options.map((option) => (
                <label key={option.value} style={{ display: 'block', marginBottom: '5px' }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: `center` }}>
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={selectedValue === option.value}
                            onChange={() => handleChange(option.value)}
                        />
                        <Text light>{option.label}</Text>
                    </Box>
                </label>
            ))}
        </div>
    );
};

export default RadioGroup;
