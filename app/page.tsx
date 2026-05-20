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
  const [search, setSearch] = useState("");

  // FORM STATE (UNCHANGED)
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

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data } = await supabase.from("reviews").select("*");
    setReviews(data || []);
  };

  // ✅ SUCCESS RATE BY DEPARTMENT
  const chartData = Object.values(
    reviews.reduce((acc: any, r: any) => {
      if (!acc[r.department]) {
        acc[r.department] = {
          department: r.department,
          total: 0,
          pass: 0,
        };
      }

      acc[r.department].total += 1;
      if (r.result === "Pass") {
        acc[r.department].pass += 1;
      }

      return acc;
    }, {})
  ).map((d: any) => ({
    department: d.department,
    successRate: Math.round((d.pass / d.total) * 100),
  }));

  // Sucess rate by product
  const productChartData = Object.values(
  reviews.reduce((acc: any, r: any) => {
    if (!acc[r.product]) {
      acc[r.product] = {
        product: r.product,
        total: 0,
        pass: 0,
      };
    }

    acc[r.product].total += 1;
    if (r.result === "Pass") {
      acc[r.product].pass += 1;
    }

    return acc;
  }, {})
).map((p: any) => ({
  product: p.product,
  successRate: Math.round((p.pass / p.total) * 100),
}));


  // ✅ FORM SUBMIT (UNCHANGED)
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
      },
    ]);

    if (error) {
      setError("Failed to submit.");
      return;
    }

    fetchReviews();

    // reset (UNCHANGED)
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
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      {/* DASHBOARD */}
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      

      
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

    {/* Department Chart */}
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        Success Rate by Department (%)
      </h2>

      <BarChart width={400} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="department" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="successRate" fill="#4CAF50" />
      </BarChart>
    </div>

    {/* Product Chart */}
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        Success Rate by Product (%)
      </h2>

      <BarChart width={400} height={300} data={productChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="product" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="successRate" fill="#2196F3" />
      </BarChart>
    </div>

  </div>


      {/* FORM (UNCHANGED STRUCTURE) */}
      <h2 className="text-2xl font-bold mb-4">Submit Audit</h2>

      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-xl">

        {/* Basic Info */}
        <input type="date" value={auditDate} onChange={(e) => setAuditDate(e.target.value)} className="w-full mb-2 p-2 border rounded" />

        <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full mb-2 p-2 border rounded">
          <option value="">Select Department</option>
          <option>DA</option>
          <option>Repair</option>
          <option>FT</option>
          <option>QA</option>
          <option>Shipping</option>
        </select>

        <select value={product} onChange={(e) => setProduct(e.target.value)} className="w-full mb-2 p-2 border rounded">
          <option value="">Select Product</option>
          <option>Mavic</option>
          <option>Mini</option>
          <option>Enterprise</option>
        </select>

        {/* People */}
        <input placeholder="Operator Name" value={operator} onChange={(e) => setOperator(e.target.value)} className="w-full mb-2 p-2 border rounded" />
        <input placeholder="Auditor Name" value={auditor} onChange={(e) => setAuditor(e.target.value)} className="w-full mb-2 p-2 border rounded" />

        {/* Audit Details */}
        <select value={auditType} onChange={(e) => setAuditType(e.target.value)} className="w-full mb-2 p-2 border rounded">
          <option value="">Select Audit Type</option>
          <option>Process</option>
          <option>Product</option>
          <option>System</option>
        </select>

        <input placeholder="Issue Type" value={issueType} onChange={(e) => setIssueType(e.target.value)} className="w-full mb-2 p-2 border rounded" />

        <select value={result} onChange={(e) => setResult(e.target.value)} className="w-full mb-2 p-2 border rounded">
          <option value="">Select Result</option>
          <option>Pass</option>
          <option>Fail</option>
        </select>

        <input placeholder="Corrective Action" value={correctiveAction} onChange={(e) => setCorrectiveAction(e.target.value)} className="w-full mb-2 p-2 border rounded" />

        {/* Flags */}
        <div className="flex gap-6 mb-2">
          <label><input type="checkbox" checked={escalation} onChange={(e) => setEscalation(e.target.checked)} /> Escalation</label>
          <label><input type="checkbox" checked={ncr} onChange={(e) => setNcr(e.target.checked)} /> NCR</label>
          <label><input type="checkbox" checked={capa} onChange={(e) => setCapa(e.target.checked)} /> CAPA</label>
        </div>

        {/* Remarks */}
        <textarea placeholder="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full mb-4 p-2 border rounded" />

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 font-semibold"
        >
          Submit Audit
        </button>
      </div>

    </div>
  );
}