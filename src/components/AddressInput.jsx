import { useRef, useEffect } from 'react';

function AddressInput({ value, onChange }) {
    const inputRef = useRef(null);

    useEffect(() => {
        if (window.google && inputRef.current) {
            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                onChange(place.formatted_address);
            });
        }
    }, [onChange]);

    return (
        <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter address"
        />
    );
}

export default AddressInput;