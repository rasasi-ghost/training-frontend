import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import Lucide from "@/components/Base/Lucide";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import { Teacher, TeacherApprovalStatus } from "@/services/AdminService";
import { formatDate } from "@/utils/formatters";

interface PendingTeacherRequestsTableProps {
  pendingTeachers: Teacher[];
  loading: boolean;
  onApprove: (teacherId: string) => Promise<void>;
  onReject: (teacherId: string) => Promise<void>;
  onViewDetails?: (teacher: Teacher) => void;
}

const PendingTeacherRequestsTable: React.FC<PendingTeacherRequestsTableProps> = ({
  pendingTeachers,
  loading,
  onApprove,
  onReject,
  onViewDetails
}) => {
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  const handleApprove = async (teacherId: string) => {
    setProcessingIds([...processingIds, teacherId]);
    try {
      await onApprove(teacherId);
    } finally {
      setProcessingIds(processingIds.filter(id => id !== teacherId));
    }
  };

  const handleReject = async (teacherId: string) => {
    setProcessingIds([...processingIds, teacherId]);
    try {
      await onReject(teacherId);
    } finally {
      setProcessingIds(processingIds.filter(id => id !== teacherId));
    }
  };

  if (pendingTeachers.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500 border rounded-lg border-slate-200/60 bg-slate-50">
        <Lucide icon="CheckCircle" className="w-16 h-16 mb-2 text-success" />
        <p className="text-lg font-medium">No pending teacher requests</p>
        <p className="text-sm text-center">All teacher applications have been processed.</p>
      </div>
    );
  }

  return (
    <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
      <Table className="border-spacing-y-[10px] border-separate -mt-2">
        <Table.Thead>
          <Table.Tr>
            <Table.Th className="border-b-0 whitespace-nowrap">
              Name
            </Table.Th>
            <Table.Th className="border-b-0 whitespace-nowrap">
              Email
            </Table.Th>
            <Table.Th className="border-b-0 whitespace-nowrap">
              Qualifications
            </Table.Th>
            <Table.Th className="border-b-0 whitespace-nowrap">
              Requested On
            </Table.Th>
            <Table.Th className="border-b-0 whitespace-nowrap text-center">
              Actions
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <Table.Tr key={i} className="intro-x">
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div className="h-4 bg-slate-200 animate-pulse rounded w-3/4"></div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div className="h-4 bg-slate-200 animate-pulse rounded w-full"></div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div className="h-4 bg-slate-200 animate-pulse rounded w-1/2"></div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div className="h-4 bg-slate-200 animate-pulse rounded w-1/2"></div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] text-center">
                    <div className="flex justify-center gap-2">
                      <div className="h-9 bg-slate-200 animate-pulse rounded w-20"></div>
                      <div className="h-9 bg-slate-200 animate-pulse rounded w-20"></div>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))
          ) : (
            pendingTeachers.map((teacher) => (
              <Table.Tr key={teacher.id} className="intro-x">
                <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                  <div className="font-medium whitespace-nowrap">
                    {teacher.displayName}
                  </div>
                </Table.Td>
                <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                  {teacher.email}
                </Table.Td>
                <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                  <div className="truncate w-48">
                    {teacher.qualification || "Not specified"}
                  </div>
                </Table.Td>
                <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                  {formatDate(teacher.createdAt)}
                </Table.Td>
                <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] table-report__action">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleApprove(teacher.id)}
                      disabled={processingIds.includes(teacher.id)}
                    >
                      {processingIds.includes(teacher.id) ? (
                        <span className="flex items-center">
                          <Lucide icon="Loader" className="w-4 h-4 mr-1 animate-spin" />
                          Processing
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Lucide icon="Check" className="w-4 h-4 mr-1" />
                          Approve
                        </span>
                      )}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleReject(teacher.id)}
                      disabled={processingIds.includes(teacher.id)}
                    >
                      <Lucide icon="X" className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    {onViewDetails && (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => onViewDetails(teacher)}
                      >
                        <Lucide icon="FileText" className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                    )}
                  </div>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>
    </div>
  );
};

export default observer(PendingTeacherRequestsTable);
