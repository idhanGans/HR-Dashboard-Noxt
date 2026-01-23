import { PAYROLL_PAYSLIP } from "./endpoints";

const PAYROLL_API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

const buildPayrollUrl = (path: string) => {
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${PAYROLL_API_BASE_URL}${normalized}`;
};

const getFilenameFromHeader = (header: string | null) => {
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
  contentDisposition: string | null,
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

const readResponseMessage = async (response: Response) => {
  const contentType = response.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("application/json")) {
      const data = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(data?.message)) return data.message.join(", ");
      if (typeof data?.message === "string") return data.message;
    }
    const text = await response.text();
    if (text) return text;
  } catch {
    return null;
  }
  return null;
};

type PayslipDownloadParams = {
  userId: number;
  month: number;
  year: number;
  employeeName: string;
  accessToken: string;
  refreshAccessToken?: () => Promise<string | null>;
};

export const downloadPayslip = async ({
  userId,
  month,
  year,
  employeeName,
  accessToken,
  refreshAccessToken,
}: PayslipDownloadParams) => {
  const path = `${PAYROLL_PAYSLIP.replace(
    ":userId",
    String(userId),
  )}?month=${month}&year=${year}`;

  const fetchPayslip = (token: string) =>
    fetch(buildPayrollUrl(path), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf",
      },
    });

  let response = await fetchPayslip(accessToken);
  if (response.status === 401 && refreshAccessToken) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      throw new Error("Not authenticated");
    }
    response = await fetchPayslip(refreshed);
  }

  if (!response.ok) {
    const message =
      (await readResponseMessage(response)) ??
      `Failed to download payslip (${response.status})`;
    throw new Error(message);
  }

  const blob = await response.blob();
  if (!blob.size) {
    throw new Error("Payslip file is empty");
  }

  const filename = buildPayslipFilename(
    employeeName,
    month,
    year,
    response.headers.get("content-disposition"),
  );
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
};
