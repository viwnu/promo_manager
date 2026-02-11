import type { PropsWithChildren, ReactNode } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";

type PageProps = PropsWithChildren<{
  title: string;
  actions?: ReactNode;
}>;

export function Page({ title, actions, children }: PageProps) {
  return (
    <Container maxWidth="lg" sx={{ py: 3, minWidth: 0 }}>
      <Stack spacing={3} sx={{ minWidth: 0 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Typography variant="h4" component="h1">
            {title}
          </Typography>
          {actions ? <Stack direction="row" spacing={1}>{actions}</Stack> : null}
        </Stack>
        <Box sx={{ minWidth: 0 }}>{children}</Box>
      </Stack>
    </Container>
  );
}
