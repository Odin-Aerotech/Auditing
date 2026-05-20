"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function Home() {
  const [reviews, setReviews] = useState<any[]>([]);

  // Auth
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const ADMIN_PASSWORD = "test@1234";

  // Form
  const [auditDate, setAuditDate] = useState("");
  const [department, setDepartment] = useState("");
  const [product, setProduct] = useState("");
  const [operator, setOperator] = useState("");
  const [auditor, setAuditor] = useState("");
  const [auditType, setAuditType] = useState("");
  const [issueType, setIssueType] = useState("");
  const [result, setResult] = useState("");
  const [correctiveAction, setCorrectiveAction] = useState("");
  const [escalation, setEscalation] = useState(false);
  const [ncr, setNcr] = useState(false);
  const [capa, setCapa] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");

  // Files
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data } = await supabase.from("reviews").select("*");
    setReviews(data || []);
  };

  // Charts
  const chartData = Object.values(
    reviews.reduce((acc: any, r: any) => {
      if (!acc[r.department]) {
        acc[r.department] = { department: r.department, total: 0, pass: 0 };
      }
      acc[r.department].total++;
      if (r.result === "Pass") acc[r.department].pass++;
      return acc;
    }, {})
  ).map((d: any) => ({
    department: d.department,
    successRate: Math.round((d.pass / d.total) * 100),
  }));

  const productChartData = Object.values(
    reviews.reduce((acc: any, r: any) => {
      if (!acc[r.product]) {
        acc[r.product] = { product: r.product, total: 0, pass: 0 };
      }
      acc[r.product].total++;
      if (r.result === "Pass") acc[r.product].pass++;
      return acc;
    }, {})
  ).map((p: any) => ({
    product: p.product,
    successRate: Math.round((p.pass / p.total) * 100),
  }));

  // Handle files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files) as File[];
    setFiles(selected);

    const previews = selected.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewUrls(previews);
  };

  
  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    const newPreviews = [...previewUrls];

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setFiles(newFiles);
    setPreviewUrls(newPreviews);
  };


  // Submit
  const handleSubmit = async () => {
    setError("");

    if (
      !auditDate ||
      !department ||
      !product ||
      !operator ||
      !auditor ||
      !auditType ||
      !result
    ) {
      setError("Please fill out all required fields.");
      return;
    }

    let fileUrls: string[] = [];

    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("audit-files")
        .upload(fileName, file);

      if (uploadError) {
        console.error(uploadError);
        setError("File upload failed");
        return;
      }

      const { data } = supabase.storage
        .from("audit-files")
        .getPublicUrl(fileName);

      fileUrls.push(data.publicUrl);
    }

    const { error } = await supabase.from("reviews").insert([
      {
        audit_date: auditDate,
        department,
        product,
        operator,
        auditor,
        audit_type: auditType,
        issue_type: issueType,
        result,
        corrective_action: correctiveAction,
        escalation,
        ncr,
        capa,
        remarks,
        file_urls: fileUrls,
      },
    ]);

    if (error) {
      setError("Failed to submit.");
      return;
    }

    fetchReviews();

    // reset
    setAuditDate("");
    setDepartment("");
    setProduct("");
    setOperator("");
    setAuditor("");
    setAuditType("");
    setIssueType("");
    setResult("");
    setCorrectiveAction("");
    setEscalation(false);
    setNcr(false);
    setCapa(false);
    setRemarks("");

    setFiles([]);
    setPreviewUrls([]);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded shadow">
          <BarChart width={400} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="successRate" fill="#4CAF50" />
          </BarChart>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <BarChart width={400} height={300} data={productChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="successRate" fill="#2196F3" />
          </BarChart>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Submit Audit</h2>

      {!isAuthorized && (
        <button
          onClick={() => setShowLogin(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        >
          Fill Out Audit
        </button>
      )}

      {isAuthorized && (
        <button
          onClick={() => setIsAuthorized(false)}
          className="mb-3 text-sm text-red-500"
        >
          🔒 Lock Form
        </button>
      )}

      {isAuthorized && (
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-xl">

          {/* FULL FORM */}
          <input type="date" value={auditDate} onChange={(e)=>setAuditDate(e.target.value)} className="w-full mb-2 p-2 border rounded"/>

          <select value={department} onChange={(e)=>setDepartment(e.target.value)} className="w-full mb-2 p-2 border rounded">
            <option value="">Select Department</option>
            <option>DA</option><option>Repair</option><option>FT</option><option>QA</option><option>Shipping</option>
          </select>

          <select value={product} onChange={(e)=>setProduct(e.target.value)} className="w-full mb-2 p-2 border rounded">
            <option value="">Select Product</option>
            <option>Mavic</option><option>Mini</option><option>Enterprise</option>
          </select>

          <input placeholder="Operator Name" value={operator} onChange={(e)=>setOperator(e.target.value)} className="w-full mb-2 p-2 border rounded"/>
          <input placeholder="Auditor Name" value={auditor} onChange={(e)=>setAuditor(e.target.value)} className="w-full mb-2 p-2 border rounded"/>

          <select value={auditType} onChange={(e)=>setAuditType(e.target.value)} className="w-full mb-2 p-2 border rounded">
            <option value="">Select Audit Type</option>
            <option>Process</option><option>Product</option><option>System</option>
          </select>

          <input placeholder="Issue Type" value={issueType} onChange={(e)=>setIssueType(e.target.value)} className="w-full mb-2 p-2 border rounded"/>

          <select value={result} onChange={(e)=>setResult(e.target.value)} className="w-full mb-2 p-2 border rounded">
            <option value="">Select Result</option>
            <option>Pass</option><option>Fail</option>
          </select>

          <input placeholder="Corrective Action" value={correctiveAction} onChange={(e)=>setCorrectiveAction(e.target.value)} className="w-full mb-2 p-2 border rounded"/>

          <div className="flex gap-6 mb-2">
            <label><input type="checkbox" checked={escalation} onChange={(e)=>setEscalation(e.target.checked)} /> Escalation</label>
            <label><input type="checkbox" checked={ncr} onChange={(e)=>setNcr(e.target.checked)} /> NCR</label>
            <label><input type="checkbox" checked={capa} onChange={(e)=>setCapa(e.target.checked)} /> CAPA</label>
          </div>

          {/* PHOTOS SECTION */}
          <div className="mb-4 border rounded-lg p-3 bg-gray-50">
            <h3 className="font-semibold mb-2">Photos</h3>

            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="w-full mb-2"
            />

            <p className="text-sm text-gray-500 mb-3">
              Upload images or videos as audit evidence
            </p>

            {/* PREVIEW */}
            <div className="flex flex-wrap gap-2">
              {previewUrls.map((url, i) => (
                <div key={i} className="relative">

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                  >
                    ×
                  </button>

                  {/* Media preview */}
                  {url.includes("video") ? (
                    <video
                      src={url}
                      className="w-24 h-24 rounded border"
                      controls
                    />
                  ) : (
                    <img
                      src={url}
                      className="w-24 h-24 object-cover rounded border"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>


          <textarea placeholder="Remarks" value={remarks} onChange={(e)=>setRemarks(e.target.value)} className="w-full mb-4 p-2 border rounded"/>

          {error && <p className="text-red-500">{error}</p>}

          <button onClick={handleSubmit} className="w-full bg-blue-600 text-white p-3 rounded-xl">
            Submit Audit
          </button>
        </div>
      )}

      {/* PASSWORD MODAL */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80">
            <h2 className="font-bold mb-2">Enter Password</h2>
            <input
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full mb-3 p-2 border"
            />
            <button
              onClick={()=>{
                if(password===ADMIN_PASSWORD){
                  setIsAuthorized(true);
                  setShowLogin(false);
                  setPassword("");
                } else {
                  alert("Incorrect password");
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 w-full"
            >
              Enter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}