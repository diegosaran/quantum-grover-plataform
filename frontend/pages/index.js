import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://quantum-grover-platform.onrender.com';

export default function Home() {
  const [searchItem, setSearchItem] = useState('AGCTTCGA');
  const [databaseSize, setDatabaseSize] = useState(100);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [image, setImage] = useState(null);

  const executeSearch = async () => {
    if (!searchItem) {
      alert('❌ Please enter a DNA sequence to search');
      return;
    }
    
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/quantum/simulate`, {
        search_item: searchItem,
        database_size: databaseSize
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error: Backend is not running!');
    }
    setLoading(false);
  };

  const generateCircuit = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/quantum/circuit?search_item=${searchItem}&database_size=${databaseSize}`
      );
      if (response.data.circuit_image) {
        setImage(response.data.circuit_image);
      } else {
        alert('⚠️ Circuit image not available');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error generating circuit');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🔍 Grover's Quantum Search</h1>
      <p style={styles.subtitle}>Quadratic speedup: O(√N) quantum vs O(N) classical</p>

      <div style={styles.card}>
        <div style={styles.field}>
          <label style={styles.label}>DNA Sequence to Search:</label>
          <input
            type="text"
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
            placeholder="Ex: AGCTTCGA"
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Database Size (N): {databaseSize}</label>
          <input 
            type="range" 
            min="10" 
            max="1000" 
            step="10"
            value={databaseSize} 
            onChange={(e) => setDatabaseSize(Number(e.target.value))}
            style={styles.range}
          />
        </div>

        <div style={styles.buttons}>
          <button 
            onClick={executeSearch} 
            disabled={loading}
            style={loading ? styles.buttonDisabled : styles.buttonPrimary}
          >
            {loading ? '⏳ Simulating...' : '🚀 Execute Quantum Search'}
          </button>
          <button 
            onClick={generateCircuit}
            style={styles.buttonSecondary}
          >
            🔬 Generate Circuit
          </button>
        </div>
      </div>

      {result && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📊 Quantum Search Result</h2>
          <p><strong>Algorithm:</strong> Grover's Search</p>
          <p><strong>Target:</strong> {result.search_item}</p>
          <p><strong>Database size:</strong> {result.database_size} items</p>
          <p><strong>Iterations needed:</strong> {result.iterations_needed}</p>
          <p><strong>Success probability:</strong> {result.probability}</p>
          <p><strong>Speedup:</strong> O(√N) vs classical O(N)</p>
          {result.measurements && (
            <div style={styles.measurements}>
              <strong>Measurement results:</strong>
              <pre style={styles.pre}>{JSON.stringify(result.measurements, null, 2)}</pre>
            </div>
          )}
        </div>
      )}

      {image && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🔬 Grover's Quantum Circuit</h2>
          <img 
            src={`data:image/png;base64,${image}`} 
            style={styles.image}
            alt="Grover quantum circuit"
          />
        </div>
      )}

      <div style={styles.status}>
        ✅ Backend: {API_BASE_URL}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 800,
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh'
  },
  title: {
    color: '#4f46e5',
    marginBottom: '5px',
    fontSize: '28px'
  },
  subtitle: {
    color: '#666',
    marginBottom: '30px',
    fontSize: '16px'
  },
  cardTitle: {
    marginTop: '0',
    marginBottom: '20px',
    color: '#333',
    fontSize: '20px'
  },
  card: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  field: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    fontFamily: 'monospace'
  },
  range: {
    width: '100%'
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  buttonPrimary: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600'
  },
  buttonSecondary: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#6b7280',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600'
  },
  buttonDisabled: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#a5b4fc',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'not-allowed',
    fontSize: '16px',
    fontWeight: '600'
  },
  measurements: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px'
  },
  pre: {
    fontFamily: 'monospace',
    fontSize: '12px',
    overflowX: 'auto'
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    border: '1px solid #e5e7eb',
    borderRadius: '8px'
  },
  status: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#ecfdf5',
    borderRadius: '8px',
    color: '#059669',
    fontWeight: '500'
  }
};