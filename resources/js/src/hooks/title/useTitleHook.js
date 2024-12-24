import { useDocumentTitle } from "@mantine/hooks";

export const useTitleHook = (title = "Elecciones") => {
    return useDocumentTitle(title);
}
