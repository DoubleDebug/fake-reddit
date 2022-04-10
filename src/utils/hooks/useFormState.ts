import { useState } from 'react';

export function useFormState() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    return {
        username,
        setUsername,
        password,
        setPassword,
        email,
        setEmail,
    };
}
