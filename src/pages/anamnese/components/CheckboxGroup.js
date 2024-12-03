import React, { useState, useEffect } from 'react';
import { Box, Text } from '../../../atoms';

const CheckboxGroup = ({ name, options, value, onBlur }) => {
    if (!options || options.length === 0) return null;

    const [selectedValues, setSelectedValues] = useState('');

    useEffect(() => {
        setSelectedValues(value);
    }, [value]);

    const handleChange = (option) => {
        const valuesArray = selectedValues ? selectedValues.split(', ').filter(v => v) : [];
        const alreadySelected = valuesArray.includes(option);
        const updatedValues = alreadySelected
            ? valuesArray.filter(v => v !== option)
            : [...valuesArray, option];

        const updatedString = updatedValues.join(', ');
        setSelectedValues(updatedString);
        onBlur(updatedString);
    };

    return (
        <div>
            {options.map((option) => (
                <label key={option.value} style={{ display: 'block', marginBottom: '5px' }}>
                    <Box sx={{display: 'flex', gap: 1, alignItems: `center`}}>
                        <input
                            type="checkbox"
                            value={option.value}
                            checked={selectedValues
                                .split(',')
                                .map(v => v.trim())
                                .includes(option.value)}
                            onChange={() => handleChange(option.value)}
                        />
                        <Text light>
                            {option.label}
                        </Text>
                    </Box>
                </label>
            ))}
        </div>
    );
};

export default CheckboxGroup;
