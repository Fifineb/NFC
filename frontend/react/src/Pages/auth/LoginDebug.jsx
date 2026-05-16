// /src/Pages/auth/LoginDebug.jsx (temporaire)
import React, { useState } from 'react';

const LoginDebug = () => {
    const [result, setResult] = useState(null);
    const [email, setEmail] = useState('test@example.com');
    const [password, setPassword] = useState('password123');

    const testLogin = async () => {
        setResult('Test en cours...');
        
        try {
            const response = await fetch('http://localhost:8081/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email,
                     motDePasse: password })
            });
            
            const data = await response.json();
            
            setResult({
                status: response.status,
                ok: response.ok,
                data: data,
                token: data.token ? 'Présent' : 'Absent',
                user: data.user || 'Non présent'
            });
            
            if (response.ok) {
                console.log('✅ Connexion réussie:', data);
            } else {
                console.error('❌ Erreur de connexion:', data);
            }
        } catch (error) {
            setResult({
                error: error.message,
                stack: error.stack
            });
            console.error('❌ Erreur réseau:', error);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h2>Debug Login</h2>
            <div>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    style={{ margin: '5px', padding: '5px' }}
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    style={{ margin: '5px', padding: '5px' }}
                />
                <button onClick={testLogin} style={{ margin: '5px', padding: '5px 10px' }}>
                    Tester la connexion
                </button>
            </div>
            {result && (
                <pre style={{ 
                    background: '#f5f5f5', 
                    padding: '10px', 
                    borderRadius: '5px',
                    marginTop: '20px',
                    overflow: 'auto'
                }}>
                    {JSON.stringify(result, null, 2)}
                </pre>
            )}
        </div>
    );
};

export default LoginDebug;