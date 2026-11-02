import type { ArticleFormData } from "@/types/article";

export type ArticleFormAction =
  | {
      type: "UPDATE_FIELD";
      field: keyof ArticleFormData;
      value: string;
    }
  | {
      type: "SET_FORM";
      payload: ArticleFormData;
    }
  | {
      type: "RESET_FORM";
      payload: ArticleFormData;
    };

export function articleFormReducer(
  state: ArticleFormData,
  action: ArticleFormAction,
): ArticleFormData {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };

    case "SET_FORM":
    case "RESET_FORM":
      return action.payload;

    default:
      return state;
  }
}
