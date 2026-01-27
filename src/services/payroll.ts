import { interceptedAxios, handleAxiosError } from "../lib/axios";
import { PAYROLL_PAYSLIP } from "./endpoints";

const getFilenameFromHeader = (header: string | null | undefined) => {
  if (!header) return null;
  const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(
    header,
  );
  const value = match?.[1] ?? match?.[2];
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const sanitizeFilename = (value: string) =>
  value.replace(/[^a-zA-Z0-9._-]+/g, "_");

const buildPayslipFilename = (
  employeeName: string,
  month: number,
  year: number,
  contentDisposition: string | null | undefined,
) => {
  const headerName = getFilenameFromHeader(contentDisposition);
  if (headerName) {
    const sanitized = sanitizeFilename(headerName);
    if (sanitized) return sanitized;
  }

  const safeName = sanitizeFilename(employeeName) || "employee";
  const monthLabel = String(month).padStart(2, "0");
  return `payslip_${safeName}_${year}_${monthLabel}.pdf`;
};

type PayslipDownloadParams = {
  userId: number;
  month: number;
  year: number;
  employeeName: string;
};

export const downloadPayslip = async ({
  userId,
  month,
  year,
  employeeName,
}: PayslipDownloadParams) => {
  const path = `${PAYROLL_PAYSLIP.replace(
    ":userId",
    String(userId),
  )}?month=${month}&year=${year}`;

  try {
    const response = await interceptedAxios.get(path, {
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    });

    const blob = response.data as Blob;
    if (!blob.size) {
      throw new Error("Payslip file is empty");
    }

    const filename = buildPayslipFilename(
      employeeName,
      month,
      year,
      response.headers["content-disposition"],
    );
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};
