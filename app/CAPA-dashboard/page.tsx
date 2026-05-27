
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CAPADashboard() {

    console.log("RENDER CAPA DASH");

    const [pending, setPending] = useState<any[]>([]);
    const [inProgress, setInProgress] = useState<any[]>([]);
    const [closed, setClosed] = useState<any[]>([]);
    
    const [selectedCapa, setSelectedCapa] = useState<any>(null);

    const [rootCause, setRootCause] = useState("");
    const [correctiveAction, setCorrectiveAction] = useState("");
    const [preventiveAction, setPreventiveAction] = useState("");
    const [responsiblePerson, setResponsiblePerson] = useState("");
    const [targetDate, setTargetDate] = useState("");


    useEffect(() => {
        fetchCAPAs();
    }, []);

    const fetchCAPAs = async () => {
        const { data } = await supabase.from("capa_records").select("*");

        if (!data) return;

        setPending(data.filter((c) => c.status === "Pending"));
        setInProgress(data.filter((c) => c.status === "In Progress"));
        setClosed(data.filter((c) => c.status === "Closed"));
    };

    // ✅ Start CAPA
    const startCAPA = async (c: any) => {
        await supabase
        .from("capa_records")
        .update({ status: "In Progress" })
        .eq("capa_id", c.capa_id);

        fetchCAPAs();
    };

    // ✅ Close CAPA
    const closeCAPA = async (c: any) => {
        await supabase
        .from("capa_records")
        .update({
            status: "Closed",
            closed_date: new Date().toISOString(),
        })
        .eq("capa_id", c.capa_id);

        fetchCAPAs();
    };

    // Submit Form
    const submitCAPAForm = async () => {
        if (
            !rootCause ||
            !correctiveAction ||
            !preventiveAction ||
            !responsiblePerson ||
            !targetDate
        ) {
            alert("Please fill all CAPA fields");
            return;
        }

        await supabase
            .from("capa_records")
            .update({
            root_cause: rootCause,
            corrective_action: correctiveAction,
            preventive_action: preventiveAction,
            responsible_person: responsiblePerson,
            target_completion_date: targetDate,
            status: "In Progress",
            })
            .eq("capa_id", selectedCapa.capa_id);

        // ✅ refresh
        fetchCAPAs();

        // ✅ reset form
        setSelectedCapa(null);
        setRootCause("");
        setCorrectiveAction("");
        setPreventiveAction("");
        setResponsiblePerson("");
        setTargetDate("");
    };

return (
  <div className="p-6 bg-gray-100 min-h-screen">

    <h1 className="text-3xl font-bold mb-6">CAPA Dashboard</h1>

    {/* ✅ Pending Section */}
    <h2 className="text-xl font-semibold mb-2">Pending</h2>
    <div className="mb-8">
      {pending.length === 0 ? (
        <p className="text-gray-500">No pending CAPAs</p>
      ) : (
        pending.map((c) => (
          <div
            key={c.capa_id}
            className="bg-white p-4 mb-3 shadow rounded"
          >
            <p className="font-bold">{c.capa_number}</p>
            <p>Case: {c.case_number}</p>
            <p>Department: {c.department}</p>
            <p>Severity: {c.severity}</p>

            <button
              onClick={() => setSelectedCapa(c)}
              className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
            >
              Start CAPA
            </button>
          </div>
        ))
      )}
    </div>

    {/* ✅ In Progress Section */}
    <h2 className="text-xl font-semibold mb-2">In Progress</h2>
    <div className="mb-8">
      {inProgress.length === 0 ? (
        <p className="text-gray-500">No CAPAs in progress</p>
      ) : (
        inProgress.map((c) => (
          <div
            key={c.capa_id}
            className="bg-yellow-100 p-4 mb-3 shadow rounded"
          >
            <p className="font-bold">{c.capa_number}</p>
            <p>Case: {c.case_number}</p>
            <p>Responsible: {c.responsible_person || "—"}</p>
            <p>Target Date: {c.target_completion_date || "—"}</p>

            <button
              onClick={() => closeCAPA(c)}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
            >
              Close CAPA
            </button>
          </div>
        ))
      )}
    </div>

    {/* ✅ Closed Section */}
    <h2 className="text-xl font-semibold mb-2">Closed</h2>
    <div>
      {closed.length === 0 ? (
        <p className="text-gray-500">No closed CAPAs</p>
      ) : (
        closed.map((c) => (
          <div
            key={c.capa_id}
            className="bg-gray-200 p-4 mb-3 shadow rounded"
          >
            <p className="font-bold">{c.capa_number}</p>
            <p>Case: {c.case_number}</p>
            <p>Closed Date: {c.closed_date}</p>
          </div>
        ))
      )}
    </div>

    {/* ✅ ✅ ✅ CAPA FORM MODAL */}
    {selectedCapa && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={() => setSelectedCapa(null)}
      >
        <div
          className="bg-white p-6 rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ✅ Close button */}
          <button
            onClick={() => setSelectedCapa(null)}
            className="absolute top-3 right-3 text-gray-500 hover:text-black"
          >
            ✕
          </button>

          <h2 className="text-xl font-bold mb-4">
            {selectedCapa.capa_number}
          </h2>

          <p><b>Case:</b> {selectedCapa.case_number}</p>
          <p className="mb-4"><b>Severity:</b> {selectedCapa.severity}</p>

          {/* ✅ Root Cause */}
          <label className="block font-semibold mb-1">
            Root Cause Analysis *
          </label>
          <textarea
            value={rootCause}
            onChange={(e) => setRootCause(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />

          {/* ✅ Corrective Action */}
          <label className="block font-semibold mb-1">
            Corrective Action *
          </label>
          <textarea
            value={correctiveAction}
            onChange={(e) => setCorrectiveAction(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />

          {/* ✅ Preventive Action */}
          <label className="block font-semibold mb-1">
            Preventive Action *
          </label>
          <textarea
            value={preventiveAction}
            onChange={(e) => setPreventiveAction(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />

          {/* ✅ Responsible Person */}
          <label className="block font-semibold mb-1">
            Responsible Person *
          </label>
          <input
            type="text"
            value={responsiblePerson}
            onChange={(e) => setResponsiblePerson(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />

          {/* ✅ Target Completion Date */}
          <label className="block font-semibold mb-1">
            Target Completion Date *
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />

          {/* ✅ Submit */}
          <button
            onClick={submitCAPAForm}
            className="w-full bg-green-600 text-white p-3 rounded"
          >
            Submit CAPA
          </button>
        </div>
      </div>
    )}

  </div>
);
}