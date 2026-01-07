
import React, { useRef, useState } from 'react';
import { PatientData, DEFAULT_PATIENT_DATA } from '../types';
import { Activity, Droplet, Heart, User, Ruler, FileText, Calendar, Layers, Upload, Cigarette, Wine, Dumbbell, Users } from 'lucide-react';

interface PatientFormProps {
  data: PatientData;
  onChange: (key: keyof PatientData, value: any) => void;
  onBulkChange?: (data: PatientData) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const InputField = ({ 
  label, value, min, max, step = 1, unit, icon: Icon, onChange, description
}: { 
  label: string; value: number; min: number; max: number; step?: number; unit?: string; icon: React.ElementType; onChange: (val: number) => void; description: string;
}) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-2 text-slate-700 font-medium">
        <Icon className="w-5 h-5 text-blue-500" />
        {label}
      </div>
      <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
        {value} {unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-2"
    />
    <p className="text-xs text-slate-500">{description}</p>
  </div>
);

const SelectField = ({
  label, value, options, icon: Icon, onChange, description
}: {
  label: string; value: string | boolean; options: string[]; icon: React.ElementType; onChange: (val: any) => void; description: string;
}) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
     <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-2 text-slate-700 font-medium">
        <Icon className="w-5 h-5 text-blue-500" />
        {label}
      </div>
    </div>
    <select 
      value={String(value)}
      onChange={(e) => onChange(e.target.value === 'true' ? true : e.target.value === 'false' ? false : e.target.value)}
      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
    >
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    <p className="text-xs text-slate-500">{description}</p>
  </div>
);

export const PatientForm: React.FC<PatientFormProps> = ({ data, onChange, onBulkChange, onSubmit, isLoading }) => {
  const [consentGiven, setConsentGiven] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      try {
        if (file.name.endsWith('.json')) {
            const parsed = JSON.parse(content);
            const newData = { ...DEFAULT_PATIENT_DATA, ...parsed };
            if (onBulkChange) onBulkChange(newData);
        } else if (file.name.endsWith('.csv')) {
            const lines = content.split('\n');
            if (lines.length > 1) {
                const headers = lines[0].toLowerCase().split(',');
                const values = lines[1].split(',');
                const newData = { ...data };
                
                headers.forEach((header, index) => {
                    const val = parseFloat(values[index]);
                    if (!isNaN(val)) {
                        if (header.includes('glucose')) newData.glucose = val;
                        if (header.includes('bmi')) newData.bmi = val;
                        if (header.includes('blood') && header.includes('pressure')) newData.bloodPressure = val;
                        if (header.includes('age')) newData.age = val;
                        if (header.includes('insulin')) newData.insulin = val;
                        if (header.includes('pedigree')) newData.diabetesPedigreeFunction = val;
                        if (header.includes('pregnancies')) newData.pregnancies = val;
                        if (header.includes('cholesterol')) newData.cholesterol = val;
                    }
                });
                if (onBulkChange) onBulkChange(newData);
            }
        }
      } catch(e) { console.error("Error parsing file", e); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Title & Upload */}
      <div className="flex items-center justify-between bg-slate-100 p-2 rounded-lg mb-4">
        <div className="flex items-center gap-2 px-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-slate-700 text-sm">Clinical & Lifestyle Data</span>
        </div>
        <div className="flex">
            <input 
                type="file" 
                ref={fileInputRef}
                accept=".json,.csv"
                onChange={handleFileChange}
                className="hidden"
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
            >
                <Upload className="w-3 h-3" />
                Load CSV/JSON
            </button>
        </div>
      </div>
      
      <div className="animate-fade-in space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Basic Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <SelectField label="Gender" value={data.gender} options={['Male', 'Female', 'Other']} icon={User} description="Biological Sex" onChange={(v) => onChange('gender', v)} />
                  <InputField label="Age" value={data.age} min={1} max={100} unit="yrs" icon={Calendar} description="Age in years" onChange={(v) => onChange('age', v)} />
                  <InputField label="BMI" value={data.bmi} min={10} max={60} step={0.1} unit="kg/m²" icon={Ruler} description="Body mass index" onChange={(v) => onChange('bmi', v)} />
                  <InputField label="Blood Pressure" value={data.bloodPressure} min={40} max={140} unit="mm Hg" icon={Activity} description="Diastolic blood pressure" onChange={(v) => onChange('bloodPressure', v)} />
                  <InputField label="Glucose" value={data.glucose} min={50} max={250} unit="mg/dL" icon={Droplet} description="Plasma glucose concentration" onChange={(v) => onChange('glucose', v)} />
                  <InputField label="Insulin" value={data.insulin} min={0} max={900} unit="mu U/ml" icon={Layers} description="2-Hour serum insulin" onChange={(v) => onChange('insulin', v)} />
                  <InputField label="Pregnancies" value={data.pregnancies} min={0} max={20} unit="" icon={Heart} description="Number of times pregnant" onChange={(v) => onChange('pregnancies', v)} />
                  <InputField label="Diabetes Pedigree" value={data.diabetesPedigreeFunction} min={0.0} max={2.5} step={0.01} unit="" icon={FileText} description="Diabetes pedigree function" onChange={(v) => onChange('diabetesPedigreeFunction', v)} />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Lifestyle & History</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InputField label="Cholesterol" value={data.cholesterol} min={100} max={400} unit="mg/dL" icon={Droplet} description="Total Cholesterol" onChange={(v) => onChange('cholesterol', v)} />
                  <SelectField label="Smoking Status" value={data.smokingHistory} options={['Never', 'Former', 'Current']} icon={Cigarette} description="Tobacco use history" onChange={(v) => onChange('smokingHistory', v)} />
                  <SelectField label="Alcohol Intake" value={data.alcoholConsumption} options={['None', 'Occasional', 'Frequent']} icon={Wine} description="Average consumption" onChange={(v) => onChange('alcoholConsumption', v)} />
                  <SelectField label="Physical Activity" value={data.physicalActivity} options={['Sedentary', 'Moderate', 'Active']} icon={Dumbbell} description="Activity Level" onChange={(v) => onChange('physicalActivity', v)} />
                  <SelectField label="Family History" value={data.familyHistory ? 'true' : 'false'} options={['true', 'false']} icon={Users} description="Immediate family history" onChange={(v) => onChange('familyHistory', v)} />
              </div>
            </div>
      </div>

      {/* Consent & Submit */}
      <div className="pt-6 border-t border-slate-200 space-y-4">
        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
             <div className="pt-0.5">
                <input 
                    type="checkbox" 
                    id="consent" 
                    checked={consentGiven} 
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
             </div>
             <div>
                <label htmlFor="consent" className="text-sm font-medium text-slate-800 cursor-pointer select-none">
                    Data Privacy & Consent
                </label>
                <p className="text-xs text-slate-500 mt-1">
                    I consent to the processing of my health data by the Neural Network model. I understand this is an AI-assisted tool and not a replacement for professional medical diagnosis. Data is encrypted according to HIPAA standards.
                </p>
             </div>
        </div>

        <div className="flex justify-center">
            <button
            onClick={onSubmit}
            disabled={isLoading || !consentGiven}
            className={`
                w-full md:w-auto px-12 py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-blue-500/30
                transform transition-all duration-200 flex items-center justify-center gap-3
                ${isLoading || !consentGiven
                ? 'bg-slate-400 cursor-not-allowed opacity-80 shadow-none' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] hover:shadow-xl'
                }
            `}
            >
            {isLoading ? (
                <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing Data...
                </>
            ) : (
                <>
                <Activity className="w-5 h-5" />
                Run Prediction Model
                </>
            )}
            </button>
        </div>
      </div>
    </div>
  );
};
