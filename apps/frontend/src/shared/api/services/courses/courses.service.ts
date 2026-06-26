import { apiClient } from "@/shared/api";
import type { ListCoursesParams, ListCoursesResponse } from "./types";

export const coursesService = {
  async list(params: ListCoursesParams = {}) {
    const { data } = await apiClient.get<ListCoursesResponse>("/courses", {
      params,
    });

    return data;
  },
};
