import React, { useState } from 'react';
import { 
  UploadCloud, FileText, CheckCircle2, AlertCircle, Database, HardDrive, 
  RefreshCw, DatabaseBackup, Settings as SettingsIcon, ShieldCheck 
} from 'lucide-react';
import { uploadCSV, seedDataset } from '../services/api';

export function SettingsView() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      const data = await uploadCSV(file);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload dataset');
    } finally {
      setUploading(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    setError(null);
    setResult(null);
    try {
      const data = await seedDataset();
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to seed dataset');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-8 rounded-3xl ba-ribbon text-white shadow-2xl">
        <div className="flex items-center space-x-2 mb-2">
          <span className="px-3 py-1 text-[10px] font-extrabold tracking-widest uppercase bg-ba-red text-white rounded-full">
            Cloud Architecture Settings
          </span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight">System Settings & Data Ingestion</h2>
        <p className="text-sm text-slate-200 mt-1 max-w-xl">
          Configure AWS S3 bucket parameters, DynamoDB schema sync, and ingest raw British Airways customer review CSVs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Drag & Drop Upload Zone */}
        <div className="skypulse-glass p-7 rounded-3xl lg:col-span-2 space-y-6">
          <h3 className="text-lg font-extrabold text-ba-navy dark:text-white flex items-center space-x-2">
            <UploadCloud className="w-5 h-5 text-ba-red" />
            <span>CSV Dataset Upload & Ingestion</span>
          </h3>

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-ba-red rounded-3xl p-10 text-center transition-all bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer group">
              <input
                type="file"
                accept=".csv"
                id="skypulse-csv-upload"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="skypulse-csv-upload" className="cursor-pointer flex flex-col items-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-ba-navy/10 dark:bg-slate-800 text-ba-navy dark:text-sky-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-ba-red group-hover:text-white transition-all">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-ba-navy dark:text-white">Click or drag & drop CSV file</span>
                  <span className="text-xs text-slate-400 block mt-1">British Airways customer feedback dataset format (.csv)</span>
                </div>
                {file && (
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-ba-navy text-white text-xs font-bold shadow-md">
                    <FileText className="w-4 h-4 text-ba-red" />
                    <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                )}
              </label>
            </div>

            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full py-4 rounded-2xl font-extrabold text-xs bg-ba-red hover:bg-ba-darkred text-white shadow-lg shadow-ba-red/25 disabled:opacity-50 flex items-center justify-center space-x-2 transition-all"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Ingesting CSV & Invoking Amazon Comprehend...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Process Dataset into S3 & DynamoDB</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Seed */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-extrabold text-ba-navy dark:text-white">Pre-packaged Dataset Available</h4>
              <p className="text-xs text-slate-400">Instantly seed 1,300+ British Airways passenger reviews.</p>
            </div>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-ba-navy text-white hover:bg-slate-800 flex items-center space-x-2 transition-all shrink-0"
            >
              {seeding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <DatabaseBackup className="w-4 h-4 text-ba-red" />}
              <span>{seeding ? 'Seeding...' : 'Quick Seed Dataset'}</span>
            </button>
          </div>
        </div>

        {/* AWS Architecture Parameters */}
        <div className="skypulse-glass p-7 rounded-3xl space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-ba-navy dark:text-white flex items-center space-x-2 mb-4">
              <SettingsIcon className="w-5 h-5 text-ba-navy dark:text-sky-400" />
              <span>AWS Cloud Parameters</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Amazon S3 Storage</span>
                <span className="font-mono font-bold text-ba-navy dark:text-sky-400 text-xs">s3://skypulse-reviews-bucket/</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Amazon DynamoDB Table</span>
                <span className="font-mono font-bold text-ba-navy dark:text-sky-400 text-xs">skypulse_reviews</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Amazon Bedrock Model</span>
                <span className="font-mono font-bold text-ba-navy dark:text-sky-400 text-xs">anthropic.claude-3-haiku</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-ba-red text-xs font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold space-y-1">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Dataset Ingested Successfully!</span>
              </div>
              <p className="text-[11px] font-normal text-slate-600 dark:text-slate-300">{result.message}</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
