import type { PropsWithChildren } from "react";
import { Box, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export type TableScrollWrapperProps = PropsWithChildren<{
  containerRef: React.RefObject<HTMLDivElement | null>;
  step?: number;
}>;

export function TableScrollWrapper({
  containerRef,
  step = 320,
  children,
}: TableScrollWrapperProps) {
  const scrollBy = (dx: number) => {
    containerRef.current?.scrollBy({ left: dx, behavior: "smooth" });
  };

  return (
    <Box sx={{ display: "flex", alignItems: "stretch", gap: 1, width: "100%" }}>
      <IconButton
        size="small"
        aria-label="Scroll left"
        onClick={() => scrollBy(-step)}
        sx={{ alignSelf: "flex-start", mt: 14 }}
      >
        <ChevronLeftIcon fontSize="small" />
      </IconButton>
      <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
      <IconButton
        size="small"
        aria-label="Scroll right"
        onClick={() => scrollBy(step)}
        sx={{ alignSelf: "flex-start", mt: 14 }}
      >
        <ChevronRightIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
