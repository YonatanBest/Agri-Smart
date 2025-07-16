import React, { useState } from 'react';

const TFLITE_API_URL = 'http://localhost:8000/api/crop-health/vgg16-predict';
const KERAS_API_URL = 'http://localhost:8000/api/crop-health/vgg16-keras-predict';
const MODEL_TFLITE_API_URL = 'http://localhost:8000/api/crop-health/model-tflite-predict';

const ImagePredictor: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [tfliteResult, setTfliteResult] = useState<any>(null);
    const [kerasResult, setKerasResult] = useState<any>(null);
    const [modelTfliteResult, setModelTfliteResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] || null);
        setTfliteResult(null);
        setKerasResult(null);
        setModelTfliteResult(null);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;
        setLoading(true);
        setError(null);
        setTfliteResult(null);
        setKerasResult(null);
        setModelTfliteResult(null);
        const formData = new FormData();
        formData.append('image', file);
        try {
            const [tfliteRes, kerasRes, modelTfliteRes] = await Promise.all([
                fetch(TFLITE_API_URL, { method: 'POST', body: formData }),
                fetch(KERAS_API_URL, { method: 'POST', body: formData }),
                fetch(MODEL_TFLITE_API_URL, { method: 'POST', body: formData })
            ]);
            if (!tfliteRes.ok || !kerasRes.ok || !modelTfliteRes.ok) throw new Error('Prediction failed');
            const tfliteData = await tfliteRes.json();
            const kerasData = await kerasRes.json();
            const modelTfliteData = await modelTfliteRes.json();
            setTfliteResult(tfliteData.prediction);
            setKerasResult(kerasData.prediction);
            setModelTfliteResult(modelTfliteData.prediction);
        } catch (err: any) {
            setError(err.message || 'Error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 border rounded shadow">
            <h2 className="text-xl font-bold mb-4">Image Prediction (VGG16)</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button type="submit" disabled={!file || loading} className="bg-blue-500 text-white px-4 py-2 rounded">
                    {loading ? 'Predicting...' : 'Predict'}
                </button>
            </form>
            {error && <div className="text-red-500 mt-2">{error}</div>}
            <div className="mt-4 grid grid-cols-1 gap-4">
                {tfliteResult && (
                    <div className="p-2 border rounded bg-gray-50">
                        <div className="font-semibold">TFLite Model</div>
                        <div><b>Class:</b> {tfliteResult.class}</div>
                        <div><b>Confidence:</b> {tfliteResult.confidence.toFixed(3)}</div>
                    </div>
                )}
                {kerasResult && (
                    <div className="p-2 border rounded bg-gray-50">
                        <div className="font-semibold">Keras Model</div>
                        <div><b>Class:</b> {kerasResult.class}</div>
                        <div><b>Confidence:</b> {kerasResult.confidence.toFixed(3)}</div>
                    </div>
                )}
                {modelTfliteResult && (
                    <div className="p-2 border rounded bg-gray-50">
                        <div className="font-semibold">Model TFLite (Alt)</div>
                        <div><b>Class:</b> {modelTfliteResult.class}</div>
                        <div><b>Confidence:</b> {modelTfliteResult.confidence.toFixed(3)}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImagePredictor; 