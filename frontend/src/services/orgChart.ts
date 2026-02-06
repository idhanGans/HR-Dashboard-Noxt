import { interceptedAxios, handleAxiosError } from "../lib/axios";
import { ORG_CHART_TREE, ORG_CHART_NODES } from "./endpoints";

export interface OrgChartUser {
  id: number;
  fullName: string;
  position?: string | null;
  photoUrl?: string | null;
}

export interface OrgChartNode {
  id: number;
  name: string;
  position?: string | null;
  parentId?: number | null;
  user?: OrgChartUser | null;
  children?: OrgChartNode[];
}

export interface OrgChartNodePayload {
  name: string;
  position?: string | null;
  parentId?: number | null;
  userId?: number | null;
}

export const getOrgChartTree = async (): Promise<OrgChartNode[]> => {
  try {
    const response = await interceptedAxios.get<OrgChartNode[]>(ORG_CHART_TREE);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

export const createOrgChartNode = async (
  payload: OrgChartNodePayload,
): Promise<OrgChartNode> => {
  try {
    const response = await interceptedAxios.post<OrgChartNode>(
      ORG_CHART_NODES,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

export const updateOrgChartNode = async (
  id: number,
  payload: Partial<OrgChartNodePayload>,
): Promise<OrgChartNode> => {
  try {
    const response = await interceptedAxios.put<OrgChartNode>(
      `${ORG_CHART_NODES}/${id}`,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

export const deleteOrgChartNode = async (id: number): Promise<void> => {
  try {
    await interceptedAxios.delete(`${ORG_CHART_NODES}/${id}`);
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};
