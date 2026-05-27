"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuditDataPage() {
  console.log("RENDER AUDIT DATA");
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedCase, setSelectedCase] = useState<any>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .order("id", { ascending: false });

    setReviews(data || []);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Audit Data</h1>

      {/* ✅ TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Audit #</th>
              <th className="p-2 border">Case #</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Department</th>
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Result</th>
              <th className="p-2 border">Severity</th>
            </tr>
          </thead>

          <tbody>
            {reviews.map((r, i) => {
              return (
                <tr key={i} className="text-center border-t">
                  <td
                    onClick={() => setSelectedCase(r)}
                    className="p-2 border font-semibold text-blue-600 cursor-pointer"
                  >
                    {r.audit_number}
                  </td>

                  <td className="p-2 border">{r.case_number}</td>
                  <td className="p-2 border">{r.audit_date}</td>
                  <td className="p-2 border">{r.department}</td>
                  <td className="p-2 border">{r.product}</td>

                  <td className="p-2 border">{r.result}</td>

                  <td className="p-2 border font-semibold">
                    {r.result === "Fail" ? (
                      <span
                        className={
                          r.severity === "Critical"
                            ? "text-red-600"
                            : r.severity === "Major"
                            ? "text-orange-500"
                            : "text-yellow-500"
                        }
                      >
                        {r.severity}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ✅ CASE DETAILS MODAL */}
      {selectedCase && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedCase(null)}
        >
          <div
            className="bg-white p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE */}
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            {/* ✅ HEADER */}
            <h2 className="text-xl font-bold mb-4">
              {selectedCase.audit_number}
            </h2>

            {/* ✅ DERIVED CAPA LOGIC */}
            {(() => {
              const requiresCAPA =
                selectedCase.severity === "Major" ||
                selectedCase.severity === "Critical";

              return (
                <>
                  <p><b>Audit #:</b> {selectedCase.audit_number}</p>
                  <p><b>Case #:</b> {selectedCase.case_number}</p>
                  <p><b>Date:</b> {selectedCase.audit_date}</p>
                  <p><b>Department:</b> {selectedCase.department}</p>
                  <p><b>Product:</b> {selectedCase.product}</p>
                  <p><b>Operator:</b> {selectedCase.operator}</p>
                  <p><b>Auditor:</b> {selectedCase.auditor}</p>
                  <p><b>Audit Type:</b> {selectedCase.audit_type}</p>
                  <p><b>Issue Type:</b> {selectedCase.issue_type}</p>
                  <p><b>Result:</b> {selectedCase.result}</p>

                  <p>
                    <b>Severity:</b>{" "}
                    {selectedCase.result === "Fail"
                      ? selectedCase.severity
                      : "—"}
                  </p>

                  <p>
                    <b>CAPA Required:</b> {requiresCAPA ? "Yes" : "No"}
                  </p>

                  <p>
                    <b>Corrective Action:</b>{" "}
                    {selectedCase.corrective_action}
                  </p>

                  <div className="mt-3">
                    <p>
                      <b>Escalation:</b>{" "}
                      {selectedCase.escalation ? "Yes" : "No"}
                    </p>
                    <p>
                      <b>NCR:</b> {selectedCase.ncr ? "Yes" : "No"}
                    </p>
                  </div>

                  <div className="mt-3">
                    <p><b>Remarks:</b></p>
                    <p className="bg-gray-100 p-2 rounded">
                      {selectedCase.remarks}
                    </p>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Attachments</h3>

                    <div className="flex flex-wrap gap-2">
                      {selectedCase.file_urls?.map((url: string, i: number) =>
                        url.includes("video") ? (
                          <video
                            key={i}
                            src={url}
                            className="w-32 h-32 rounded border"
                            controls
                          />
                        ) : (
                          <img
                            key={i}
                            src={url}
                            className="w-32 h-32 object-cover rounded border"
                          />
                        )
                      )}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}